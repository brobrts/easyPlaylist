'use strict';

angular.module('playlistModule',['audioModule'])
.directive('playlistDirective',function () {
    return{
        restrict: 'A', 
        scope: {       
           playlist: '='
        },
        templateUrl: 'playlist-source/playlist-directive.html',
        link: function (scope, elem, attrs){
          //console.log("playlistDir playlist.length: " + scope.playlist.length);          
        },
        controller: function($scope){
          //console.log("playlistDir playlist.length: " + $scope.playlist.length);
        }
    };
})
.directive('innerPlaylistDirective', function() {
    return {
        priority: 100,		  
        scope: {
          playlist: "=", 
          propName: "@"
        },
        transclude: 'true', // BUG?---jQLite find doesn't work when this property is set. 
        restrict: 'A',
        compile: function (element, attrs, transcludeFn) {
            return {
               post: function ($scope, $element, $attr){                      
               },
               pre: function ($scope, $element, $attr){
                  $scope.$watch("playlist.length", function (){
                     var parent = $element;
                     parent.children().remove();                                              
                     for (var i = 0; i < $scope.playlist.length; i++){
                        var childScope = $scope.$new();                       
                        childScope[$scope.propName] = $scope.playlist[i];
                        transcludeFn( childScope, function (clone) {
                           parent.append(clone);
                        });
                     }
                  }); 
               } 
            }  
          },
          controller: function ($scope, $rootScope) { 
           $scope.audioFileType = "";
           $scope.currentTrack = 0; 
        
           // check for html5 audio support
           var audioTest = (function(){
              // destroy?  use the same one...don't want two!
              var audioElem = document.createElement('audio');
              if (audioElem.canPlayType('audio/mp3')) {
                 $scope.audioFileType = "mp3";
              }
              else if (audioElem.canPlayType('audio/ogg')){
                 $scope.audioFileType = "ogg";
              }
              else{
                 $scope.audioFileType = "noSupport";
                 var msg = "Your browser doesn't support mp3 or ogg.";
                 console.log(msg);
                 throw msg;
              } 
           })();

           // the user selected a tune in the list
           $scope.ckTune = function(title){
              //1.) find it
              for  (var index = 0; index < $scope.playlist.length; index++) {
                 if(title === $scope.playlist[index].title){
                    $scope.currentTrack = index;
                    $scope.updateTrack();
                 }
              }
           };

           $scope.updateTrack = function(){
              if(!angular.isArray($scope.playlist) || $scope.playlist.length === 0){
                console.log("updateTrack: noData");
                return "noData";
              }

              var audioFile;
              if ($scope.audioFileType === "noSupport"){
                 // module.run throws on this error.
                 return "noSupport";
              }
              else if($scope.audioFileType === "mp3"){
                 audioFile = $scope.playlist[$scope.currentTrack].mp3File;
              }
              else {
                 audioFile = $scope.playlist[$scope.currentTrack].oggFile;
              }
              //todo: let the client specify the directory with the audio file(s).
              //pass this into the playlist directive.
              $rootScope.$broadcast('audio.set', 
                 'playlist-source/audio/' + audioFile, 
                 $scope.playlist[$scope.currentTrack], 
                 $scope.currentTrack, 
                 $scope.playlist.length);              
           };
          
           //todo: css disables these.  put an index test to do the same.
           $rootScope.$on('audio.next', function(){
              $scope.currentTrack++;
              if ($scope.currentTrack < $scope.playlist.length){
                  $scope.updateTrack();
              }else{
                 $scope.currentTrack = $scope.playlist.length-1;
              }
           });          
           $rootScope.$on('audio.prev', function(){
              $scope.currentTrack--;
              if ($scope.currentTrack >= 0){
                 $scope.updateTrack();
              }else{
                 $scope.currentTrack = 0;
              }
           });           
           $rootScope.$on('audio.ready', function(){
              if ($scope.currentTrack >= 0){
                 $scope.updateTrack();
              }
           });           
        }
    }
 }); 



