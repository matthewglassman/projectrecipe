  $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
  });


//Pulling data from youTube and populating page with videos

function populateYouTubeVideos(){

//This variable will be a string that is pulled from flexdatalist and will be used to generate videos and recipes.
var searchYouTube = "zucchini, cheese, beef";

//This variable will be user input based on the number of videos they want to search for.
var numRecipesToReturn = "10";

 var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q="+searchYouTube+"&type=video&order=relevance&maxResults="+numRecipesToReturn+"&key=AIzaSyBpu8hgnXbkqFVWrAvwRUEz7T13ii3I7WM";
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
          iFrameDiv.attr("class", "video-container")
          ;
          iFrameDiv.attr("id","iFrameDiv");

          var iFrame = $("<iframe></iframe>");
          iFrame.attr("type", "text/html");
          iFrame.attr("width", "320");
          iFrame.attr("height", "195");
          iFrame.attr("src", videoSRC);
          iFrame.attr("frameborder", "0");
          iFrame.attr("id", "recipeVideo");

          $("#videoBank").append(iFrameDiv);
          iFrameDiv.append(iFrame);

        }


});
}

// populateYouTubeVideos();
