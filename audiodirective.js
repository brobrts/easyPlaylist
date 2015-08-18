'use strict';

angular.module('audioModule',[])
.directive('audioDirective', function() {
	return {
		restrict: 'EA',
		scope: {},
		templateUrl: 'playlist-source/audio-directive.html',
        
        controller: function($scope, $rootScope, $element, $document, $timeout) {
            console.log("audio controller init");
            $scope.trackData = {};
            $scope.trackData.currentVol = 0.5; //todo. specifiy this in one place.  remove from html...?    
            $scope.trackData.currentTime = 0;
            $scope.trackData.duration = 0;
            $scope.trackData.playListEntry = "";
            $scope.trackData.currentTrack = 0; // disable prev if 0           
            $scope.trackData.totalTracks = 0;   // disable next if max-1   

            //TODO: put a mp3/oog test here before calling Audio();
            $scope.audio = new Audio(); 

            // can jQLite be used to do this?
            $scope.volChanged = function() {
                var fader = $document[0].getElementById('volFader');
                var angFader = angular.element(fader);
                var vol = angFader.val(); 
                $scope.trackData.currentVol = $scope.audio.volume = vol;
            };
            // triggered by ngChange to update audio.currentTime
            $scope.seeked = function(){
                $scope.audio.currentTime = $scope.trackData.currentTime;
            };
            $scope.updateTimeUi = function(currentTime, duration){        
                $scope.trackData.duration = duration;
                $scope.trackData.currentTime = currentTime;
            }; 

            // client code listens for this and sets track with audio.set message
            $scope.next = function(){ 
                $rootScope.$broadcast('audio.next'); 
            };
            $scope.prev = function(){ 
                $rootScope.$broadcast('audio.prev'); 
            };                   
            $scope.playpause = function()
            { 
                //todo: fix this
                var a = $scope.audio.paused ? 
                   $scope.audio.play() : $scope.audio.pause(); 
            };

            // client code listens for this and sets track with audio.set message
            $scope.ready = function(){ 
                console.log("ready");
                $rootScope.$broadcast('audio.ready'); 
            };
             
            //************************************************************ 

            // html5 event to update scrub
            $scope.audio.addEventListener('timeupdate', function(){
                $scope.trackData.currentTime = $scope.audio.currentTime;
                $scope.trackData.duration = $scope.audio.duration;
                // hack: prevents jerky seek interaction on slider.         
                $timeout(function(){
                    $scope.updateTimeUi($scope.trackData.currentTime,
                                        $scope.trackData.duration);
                }, 0);           
            });         

            $scope.audio.addEventListener('canplay', function(){
                //has buffered enough to begin 
                //$scope.audio.play();
            });                
            //send events to client so they can maintain the play list
            $scope.audio.addEventListener('play', function(){ 
                  $rootScope.$broadcast('audio.play', this); 
            });
            $scope.audio.addEventListener('pause', function(){
                  $rootScope.$broadcast('audio.pause', this); 
            });
            $scope.audio.addEventListener('ended', function(){ 
                  $rootScope.$broadcast('audio.ended', this);
                  //Bug, need to be able to set wasPlaying = true globaly.
                  //Fix: this logic belongs in the playList directive's 
                  //controller.
                  $scope.next(); 
            });   


            //************************************************************
            $rootScope.$on('audio.set', function(evt, 
                                                 audioFile, 
                                                 playlistEntry, 
                                                 currentTrack, 
                                                 totalTracks){
                //This logic belongs in the playList.
                console.log("audio.set received");
                var play = !$scope.audio.paused;
                $scope.audio.src = audioFile; 
                $scope.trackData.playListEntry = playlistEntry;   
                $scope.trackData.currentTrack = currentTrack; // disable prev if 0           
                $scope.trackData.totalTracks = totalTracks;     // disable next if max-1
                // if it is paused leave it paused.
                if(play){
                    $scope.audio.play();
                }
            });
 
            // Use this to pause the audio when the user moves to another page.
            $rootScope.$on('xtrnlLnkClicked', function(){
                $scope.audio.pause();
            });
        }, // end return

		link: function(scope, element, attrs) {
            console.log("audio post link");
            scope.ready();
		}
	};
});
