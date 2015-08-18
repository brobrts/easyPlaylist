# easyPlaylist
quick and easy html5 audio playlist

Please select 'Raw' to view the html fragments in this doc.

1.) clone into playlist-source/.  the code expects this to be a top level directory. If this doesn't work for you,
    you can search for the directory (playlist-source) in the code and change it very quickly.

2.) Add this at the end of your angular modules in index.html:
    <script src="playlist-source/audiodirective.js"></script>
    <script src="playlist-source/playlistdirective.js"></script>

3.) Add this tag where you want to include the playlist:
     <div class="panel-body" playlist-directive
                             playlist="musicData.playlist">
    </div>

4.) Add a dependency to your module for the playlist:
     angular.module('playlistSampleApp', ['playlistModule']). …

5.) Add your playlist to your controller. Add the $http dep in your controller as well.

   // don't forget to get a dot. :)
   $scope.musicData = {};
   $scope.musicData.playlist = [];

   $http.get('playlist-source/data/music.json').success(function(response){
       console.log("http.get");
       $scope.musicData.playlist = response;    
  });

6.) Last add this style which is required for the play/pause button to work properly.
  audio-directive .paused .play-text,
  audio-directive .pause-text {
    display:inline-block;
  }
  audio-directive .play-text, 
  audio-directive .paused .pause-text {
    display:none;
  }

7.) It should be working now.  You can also download the working sample app that was
    created with generator angular.
    
    
  






