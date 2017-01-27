//This variable will be used to store the search parameters from the flexdatalist.
var searchParameters;

//This variable will be user input based on the number of videos they want to search for.
var numRecipesToReturn;


  $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    $(".button-collapse").sideNav();
    $('ul.tabs').tabs();
  });

//Materialize Scrolling to Tabs



//Pulling data from youTube and populating page with videos

function populateYouTubeVideos(){

//This variable will be user input based on the number of videos they want to search for.

 var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q="+searchParameters+"&type=video&order=relevance&maxResults="+numRecipesToReturn+"&key=AIzaSyB5ewohlv82vxqUvMYZCS_htMbXO_U66K8";
      // console.log(searchYouTube);
      console.log(queryURL);

      $.ajax({
        url: queryURL,
        method: "GET"
      })

      .done(function(response) {
        var results = response.items;
        console.log(results);

        for(var i = 0; i < numRecipesToReturn; i++){

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

//Flexdatalist//

$("#ingredientsInput").flexdatalist({
     minLength: 1
});

//On-click of "Let's get cooking!" button, the search parameters from flexdatalist are captured. Cleared out because we do not want to waster YouTube API calls!!

$("#find-recipe").on("click", function(event){
  event.preventDefault();
  searchParameters = $("[name=ingredients]").val();
  console.log(searchParameters);

  numRecipesToReturn= $("#numOfRecipes").val();
  console.log(numRecipesToReturn);

  });
//When you click My Saved Recipes or Let's Get Cooking it will scroll to the appropriate container.


  // if (isNaN(numRecipesToReturn)){
  //   $("#badNumber").html("<b>Not A Number</b>");
  //   $("#badNumber").show();
  //   $("#find-recipe").return("false"); 
  // }else if (numRecipesToReturn < "1"){
  //   $("#badNumber").html("<b>Must Not Be Less Than 1</b>");
  //   $("#badNumber").show();
  //   $("#find-recipe").return("false");
  // }else{
  //   $("#badNumber").clear();
  //   $("find-recipe").return("true");
  // };

//   populateYouTubeVideos();

//Takes user to Recipe tab
// var takeMeTo = window.location;
// takeMeTo = $(this).data("url");
// console.log("takemeto: "+takeMeTo);

// $(".scrollToBtm").on("click", function(event){

//   $("nav, body, html").animate({
//     scrollTop: $($(this).attr("href")).offset().top}, 600);

// });

