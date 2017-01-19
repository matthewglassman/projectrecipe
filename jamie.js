
//Pulling data from youTube and populating page with videos

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
