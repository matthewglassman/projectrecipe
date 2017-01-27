
//---------------------------------------------------------------------------------------
//----------------------------VARIABLES--------------------------------------------------
var errMsg = "Not Available";
var recipeResults = [];
var recipeResultArray = [];
//var recipeCount = 10;
//var search_ingredients = "oranges%2Cflour%2Cchicken";
var current_user = "";
//This variable will be user input based on the number of recipes they want to search for.
var numRecipesToReturn;
var searchParameters;

// Initialize Firebase
 var config = {
   apiKey: "AIzaSyBU2qGBrMCbhsoy2rx5jd-EJP4CBw6LJqU",
   authDomain: "projectrecipe-50fac.firebaseapp.com",
   databaseURL: "https://projectrecipe-50fac.firebaseio.com",
   storageBucket: "projectrecipe-50fac.appspot.com",
   messagingSenderId: "312276130376"
 };
 firebase.initializeApp(config);

 // Create a variable to reference the database
var databaseRef = firebase.database();

//create a reference to root of the database and also create a child called 'users' to store user details
var usersRef = firebase.database().ref().child('users');

//--------------------------------------------------------------------------------------
//-----------------------------FUNCTIONS------------------------------------------------
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

// This function extracts the recipe information from the ajax response of Spoonacular API
function extractRecipeInfo(){

        console.log("extractRecipeInfo: ", recipeResults);

        for (var i = 0, j = recipeResults.length; i < j; i++) {

                //Recipe Info Object
                var RecipeInfo = {
                                   recipeTitle: "",
                                   readyMins: 0,
                                   creditText: "",
                                   usedIngredArray: [],
                                   missedIngredArray: [],
                                   recipeURL: "",
                                   imageURL: ""
                };

                //Get the recipe title
                console.log("Title: " + recipeResults[i].title);
                if (typeof(recipeResults[i].title) === "undefined" || recipeResults[i].title === " " ) {
                        RecipeInfo.recipeTitle = errMsg;
                }else{
                    RecipeInfo.recipeTitle = recipeResults[i].title;
                }

                //Get the Ready in Minutes
                console.log("Cooking minutes: " + recipeResults[i].readyInMinutes);
                if (typeof(recipeResults[i].readyInMinutes) === "undefined" || recipeResults[i].readyInMinutes === 0 ) {
                        RecipeInfo.readyMins = errMsg;
                }else{
                    RecipeInfo.readyMins = recipeResults[i].readyInMinutes;
                }

                //Get the Credit text
                console.log("Credit text: " + recipeResults[i].sourceName);
                if (typeof(recipeResults[i].sourceName) === "undefined" || recipeResults[i].sourceName === " " ) {
                       // console.log("%csourceName was undefined", 'background: #222; color: #bada55')
                        RecipeInfo.creditText = errMsg;
                }else{
                    RecipeInfo.creditText = recipeResults[i].sourceName;
                }

                //Get the used Ingredients
                RecipeInfo.usedIngredArray = addIngredients(recipeResults[i].usedIngredients);

                //Get the missed Ingredients
                RecipeInfo.missedIngredArray = addIngredients(recipeResults[i].missedIngredients);

                //Get the recipe URL
                console.log("Recipe URL: " + recipeResults[i].sourceUrl);
                if (typeof(recipeResults[i].sourceUrl) === "undefined" || recipeResults[i].sourceUrl === " " ) {
                        RecipeInfo.recipeURL = errMsg;
                }else{
                    RecipeInfo.recipeURL = recipeResults[i].sourceUrl;
                }

                //Get Image URL
                console.log("Image URL: " + recipeResults[i].image);
                if (typeof(recipeResults[i].image === "undefined" || recipeResults[i].image === " " )) {
                    RecipeInfo.imageURL = recipeResults[i].image;
                }


                //Push the object to recipeResultArr
                recipeResultArray.push(RecipeInfo);
        }
}

//This function returns an html <li> element  based on the input arguments array and span
function styleIngredients(inputArr, spanVal){
    var html = "";

    for(i=0; i<inputArr.length; i++){
        html += "<li>" + inputArr[i].amount + " " + inputArr[i].unit + " " + "<span class=" + spanVal + ">" + inputArr[i].name + "</span> </li>";
    }
    return html;

}

//This function creates recipe cards for each recipe in the recipe results array
function createRecipeCards(){
    //clear the recipes-container
    $("#recipes-container").empty();

    $.each(recipeResultArray, function( index,   value ) {

        var imgClass = "ch-img-" + index;

        var html = "<div class = 'col s12 m6 l6'>" ;
        html += "<div class='card'>";
        html += "<div class='card-content'>";
       /* html += "<div class='card-content " + imgClass + "'>";*/
        html += "<div class='ch-item " + imgClass + "'>"
        html += "<div class='ch-info-wrap'>";
        html += "<div class='ch-info'>";
        /*html += "<div class='ch-info-front'" + "id=" + ch_info_front_ID +"></div>";*/
        html += "<div class='ch-info-front " + imgClass + "'></div>";
        html += "<div class='ch-info-back'>";
        html += "<h5>Ingredients: </h5>";
        html += "<ul>";
        html += styleIngredients(value.usedIngredArray, "used");
        html += styleIngredients(value.missedIngredArray, "missed");
        html += "</ul>";
        html += "<p class = 'readymin'> Ready in " + value.readyMins + " minutes </p>";
        html += "<div id='recipe-source'><p><a href=" +  value.recipeURL + " target='_blank'>Get the recipe</a></p></div>";
        html += "</div></div></div></div>";
        html += "<div class='card-action'>";
        html += "<span class='card-title'>" + value.recipeTitle + "</span>";
        html += "<h6 class = 'credit-text'>via " + value.creditText + "</h6><br />";
        html += "<div class = 'save-recipe' data-recipeTitle ='" + value.recipeTitle + "' data-recipeURL = '" +  value.recipeURL + "' data-recipeImgURL = '" +  value.imageURL + "'><a class='waves-effect pink darken-4 btn-flat'>+ SAVE</a></div>";
        html += "</div></div></div></div>";

        /*$("div#" + ch_item_ID).addClass(imgClass);
        $("div#" + card_content_ID).addClass(imgClass);
        $("div#" + ch_info_front_ID).addClass(imgClass);*/
        console.log(html);
        $("#recipes-container").append(html);
        $('.' + imgClass).css({
                            'background-image': 'url(' + value.imageURL + ')',
                            'background-size' : 'cover'
                            });

        //Logging
        console.log("recipeTitle: " + value.recipeTitle);
        console.log("readyMins: " + value.readyMins);
        console.log("creditText: " + value.creditText);
        console.log("usedIngredArray: " + value.usedIngredArray);
        console.log("missedIngredArray: " + value.missedIngredArray);
        console.log("recipeURL: " + value.recipeURL);
        console.log("imageURL: " + value.imageURL);

        for(i=0; i<value.usedIngredArray.length; i++){
            console.log(value.usedIngredArray[i] + "  ");

        }

    });

}

//Add Ingredients to Ingredient Array
function addIngredients(inputArray){
    var ingredArray = [];

    for (var i = 0, j = inputArray.length; i < j; i++) {
         var ingredObject = {
                        amount: 0,
                        unit: "",
                        name: ""
          };
        //Add check for undefined
            ingredObject.amount = inputArray[i].amount.toFixed(1);
            ingredObject.unit = inputArray[i].unitLong;
            ingredObject.name = inputArray[i].name;

            console.log(i + ": " + ingredObject.amount + ingredObject.unit + " " + ingredObject.name);
            //Push ingedObject to ingredArray
            ingredArray.push(ingredObject);
    }

    //Debugging and Logging
    console.log("Ingredients: ")
    for (var i = 0, j = ingredArray.length; i < j; i++) {
            console.log(ingredArray[i]);
    }

    return ingredArray;
}

// Create html for saved recipe cards
function createSavedRecipeCards(recipeInfo){

    console.log(recipeInfo);

    var img = "http://lorempixel.com/100/190/nature/6";

    var html = "<div class='col s12 m6 l6'>";

    html += "<div class='card horizontal' id='savedCard'>";
    html += "<div class='card-image'>";
    html += "<img src='" + recipeInfo.imgURL + "' class = 'circle responsive-img'></div>";
    html += "<div class='card-stacked'>";
    html += "<div class='card-content' id = 'savedCard-panel'>";
    html += "<h5><a href='" + recipeInfo.recURL + "' target='_blank' class ='black-text'>" + recipeInfo.recTitle + "</a></h5></div>";
    html += "</div></div></div>";

    console.log(html);

return html;

}

// This function pulls saved recipes from database for the logged in user and write it to the saved recipes tab
function getSavedRecipes(currUser){

    //Fetch the saved recipes for the specific user
    databaseRef.ref().child('users').orderByChild('userName').equalTo(currUser).once("value", function(snapshot){
        //usersRef.orderByChild('jincy').once("value", function(snapshot){
        console.log(snapshot.val());

        //Check if user exists in databse
        var exists = (snapshot.val() !== null);
        console.log(exists);


        //Get the saved recipes only if user exists in DB
        if(exists) {
            console.log(snapshot.child(currUser).val().savedRecipes);

            //Clear the html in My Saved Recipes tab
            $("#savedRecipes-container").empty();

            var arrSavedRecipes = snapshot.child(currUser).val().savedRecipes;
            console.log(arrSavedRecipes);

            //Proceed only if there is atleast one saved recipe
            if(typeof arrSavedRecipes !== "undefined"){

                //Loop through the array and generate html for each recipe
                for ( i = 0, j = arrSavedRecipes.length; i<j; i++){

                    console.log(arrSavedRecipes[i]);

                    var html = createSavedRecipeCards(arrSavedRecipes[i]);

                    $("#savedRecipes-container").append(html);
                }
            }

        }


    });


}

//This function adds user data to database
function addUserData(){

    var userArray = ["jincy", "jamie", "mathew", "kathleen"];
    var recipeInfoArray1 = [
                            /*{recTitle: "recipe1", recURL: "recipeURL1", imgURL: "IMAGEurl1"}*/
                            ];

    for(i=0; i<userArray.length; i++){

            var myUser = usersRef.child(userArray[i]);
            myUser.set({
                    userName: userArray[i],
                    savedRecipes: recipeInfoArray1
        });

    }

}


//--------------------------------------------------------------------------------------
//--------------------------MAIN PROCESS------------------------------------------------

//------------------------ON DOCUMENT LOAD----------------------------------------------

$(document).ready( function(){
    $('.scrollspy').scrollSpy({
        scrollOffset: 0
    });

    $('.modal').modal();
    $(".button-collapse").sideNav();
    $('ul.tabs').tabs();
    console.log("Write to database");

    //Write to databse for first time
    //addUserData();

});

//----------------------------------------------------------------------------------------------------
//----------------------------------------LOGIN - ON CLICK -------------------------------------------
//Capture Username From User Input and also load the saved recipes from the database//

$("#user-login").on("click", function(event){

    event.preventDefault();

    current_user = $(".unEntered").val().trim();

    //Check if user exists in database, If not display an error and ask to login again

    //Display username along with "What's in your Pantry"
    $("#displayMember").html(", "+ current_user);

    // Pull saved recipes from database for the logged in user and write it to the saved recipes tab
    getSavedRecipes(current_user);

});

//----------------------------------------------------------------------------------------------------
//---------------------------WRITE NEW SAVED RECIPES TO THE SAVED RECIPES TAB-------------------------


usersRef.on("child_changed", function(snapshot){


    console.log("Inside child changed");

    console.log(snapshot.val());

    var arrSavedRecipes = snapshot.val().savedRecipes;

    //Get the last entry in recipe array
    var recentSavedRecipe = arrSavedRecipes[arrSavedRecipes.length - 1];

    console.log(recentSavedRecipe);

    var html = createSavedRecipeCards(recentSavedRecipe);

    $("#savedRecipes-container").append(html);

    //console.log(snapshot.child(current_user).val().savedRecipes);


});

//----------------------------------------------------------------------------------------------------
//----------------------------------------Spoonacular API call----------------------------------------


// This .on("click") function will trigger the AJAX Call
$("#find-recipe").on("click", function(event) {
    //In order for the button to scroll and open the proper tab, we need to change it's class to "active" on-click
    $("#recipeBank").css("display", "block");
    $("#userSavedRecipes").css("display", "none");

    // Preventing the submit button from trying to submit the form
    console.log("Button clicked");
    // We're optionally using a form so the user may hit Enter to search instead of clicking the button
    event.preventDefault();

    //Here we grab the text from the input box for number of recipes entered by user and the search ingredients
    searchParameters = $("[name=ingredients]").val();
    console.log(searchParameters);

    numRecipesToReturn= $("#numOfRecipes").val();
    console.log(numRecipesToReturn);
  
    //Here we are replacing the commase in the search parameters with %2C
    var search_ingredients = searchParameters.replace(/,/g, "%2C");
    console.log (search_ingredients);

    // Here we construct our URL
    var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?";

    //URL parameters
    //addRecipeInformation: If set to true, you get more information about the recipes returned.
    queryURL = queryURL + "addRecipeInformation=true&";
    //fillIngredients: setting fill Ingredients to true which returns information about the used and missing ingredients in each recipe.
    queryURL = queryURL + "fillIngredients=true&";

    //includeIngredients: A comma-separated list of ingredients that should/must be contained in the recipe.
    queryURL = queryURL + "includeIngredients=" + search_ingredients + "&";

    //instructionsRequired: Whether the recipes must have instructions.
     queryURL = queryURL + "instructionsRequired=true&";

    //limitLicense: Whether to only show recipes with an attribution license.
    queryURL = queryURL + "limitLicense=false&";

    //number: The maximal number of recipes to return (default = 5).
    queryURL = queryURL + "number=" + numRecipesToReturn + "&";

    //ranking: Whether to maximize used ingredients (1) or minimize missing ingredients (2) first.
    queryURL = queryURL + "ranking=1";

    //Log queryRL
    console.log(queryURL);

    $.ajax({
        url: queryURL, // The URL to the API.
        type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
        data: {}, // Additional parameters here
        dataType: 'json',
        success: function(response) {

            recipeResults = response.results;

            //Extract the recipe Information from the JSON response
            extractRecipeInfo();

            //Dynamically create Recipe cards from the recipe extract
            createRecipeCards();

            console.log(response);

        },
        error: function(err) {
            console.log(err);
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("X-Mashape-Authorization", "DkuFs3Z8eRmshBsXlCBx4k4DtVVQp1yqSBNjsnQK6GEBL5cHfT");
        }
    });

  // populateYouTubeVideos();

});

//When save recipe button is clicked, notify the user and save recipe to the database
$("#recipes-container").on("click",".save-recipe", function(event){

   var searchUser = current_user;

   
   var savedTitle = $(this).attr("data-recipeTitle");
   console.log(savedTitle);
   var savedURL = $(this).attr("data-recipeURL");
   console.log(savedURL);
   var savedRecipePhoto = $(this).attr("data-recipeImgURL");
   console.log(savedRecipePhoto);

    //update records already in the database
    var newRecipe = {recTitle: savedTitle, recURL: savedURL, imgURL: savedRecipePhoto};
    console.log(this);
     databaseRef.ref().child('users').orderByChild('userName').equalTo(searchUser).once("value", function(snapshot){

        console.log(snapshot.val());

        console.log(snapshot.child(searchUser).val().savedRecipes);

        var savedRecipeArray = snapshot.child(searchUser).val().savedRecipes;

         if (typeof savedRecipeArray !== "undefined"){
            savedRecipeArray.push(newRecipe);
        }else{
            savedRecipeArray=[];
            savedRecipeArray[0] = newRecipe;
        }


        console.log(savedRecipeArray);

        var currUserRef = usersRef.child(searchUser);

        currUserRef.set({
                userName: searchUser,
                savedRecipes: savedRecipeArray
        });

    });

 // Materialize.toast(message, displayLength, className, completeCallback);
    Materialize.toast('Recipe saved!', 3000);
});

//Flexdatalist//

$("#ingredientsInput").flexdatalist({
     minLength: 1
});

//Toggling between active tabs after clicking "My Saved Recipes" on mobile view and closes navbar//

$("#mySavedMobile").on("click", function(){
    $(".button-collapse").sideNav({
         closeOnClick: true
    });
});






