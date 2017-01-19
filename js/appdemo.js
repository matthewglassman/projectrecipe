//Variables




$(document).ready(function(){
      $('.slider').slider({full_width: true});
    });

// Pause slider
$('.slider').slider('pause');
// Start slider
$('.slider').slider('start');
// Next slide
$('.slider').slider('next');
// Previous slide
$('.slider').slider('prev');

// $('.flexdatalist').flexdatalist({
//      minLength: 1,
//      textProperty: '{capital}, {name}, {continent}',
//      valueProperty: 'id',
//      selectionRequired: true,
//      visibleProperties: ["name","capital","continent"],
//      searchIn: 'name',
//      data: 'countries.json'
// });

var ingredients




function populateYouTubeVideos(){

var searchYouTube = "zucchini, cheese, beef";

 var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q="+searchYouTube+"&type=video&order=date&maxResults=10&key=AIzaSyBpu8hgnXbkqFVWrAvwRUEz7T13ii3I7WM";
      console.log(searchYouTube);
      console.log(queryURL);

      $.ajax({
        url: queryURL,
        method: "GET"
      })

      .done(function(response) {
        var results = response.items;
        console.log(results);

        for(var i = 0; i < 10; i++){

          var videoId = results[i].id.videoId;
          console.log(videoId);

          var videoSRC = "http://www.youtube.com/embed/"+videoId+"?enablejsapi=1&origin=http://example.com";

          var iFrameDiv = $("<div>");
          iFrameDiv.attr("class", "container col s6");

          var iFrame = $("<iframe></iframe>");
          iFrame.attr("type", "text/html");
          iFrame.attr("width", "320");
          iFrame.attr("height", "195");
          iFrame.attr("src", videoSRC);
          iFrame.attr("frameborder", "0");

          $("#videoBank").append(iFrameDiv);
          iFrameDiv.append(iFrame);

        }


});
}

populateYouTubeVideos();

// Resolved

// v3 URL is https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId={PLAYLIST_ID}&key={KEY}

// https://www.googleapis.com/youtube/v3/videos?id=itemId&key=apiKey&fields=items(snippet(title))&part=snippet


//Functions




//AJAX Calls






