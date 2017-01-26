
//---------------------------------------------------------------------------------------
//----------------------------VARIABLES--------------------------------------------------
var errMsg = "Not Available";
var recipeResults = [];
var recipeResultArray = [];
var recipeCount = 10;
var search_ingredients = "oranges%2Cflour%2Cchicken";
var current_user = "";
//This variable will be user input based on the number of recipes they want to search for.
var numRecipesToReturn = 0;

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

// This function extracts the recipe information from the ajax response of Spoonacular API
function extractRecipeInfo(){

        console.log(recipeResults);

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
                if (recipeResults[i].title === "undefined" || recipeResults[i].title === " " ) {
                        RecipeInfo.recipeTitle = errMsg;
                }else{
                    RecipeInfo.recipeTitle = recipeResults[i].title;
                }


                //Get the Ready in Minutes
                console.log("Cooking minutes: " + recipeResults[i].readyInMinutes);
                if (recipeResults[i].readyInMinutes === "undefined" || recipeResults[i].readyInMinutes === 0 ) {
                        RecipeInfo.readyMins = errMsg;
                }else{
                    RecipeInfo.readyMins = recipeResults[i].readyInMinutes;
                }

                //Get the Credit text
                console.log("Credit text: " + recipeResults[i].sourceName);
                if (recipeResults[i].sourceName === "undefined" || recipeResults[i].sourceName === " " ) {
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
                if (recipeResults[i].sourceUrl === "undefined" || recipeResults[i].sourceUrl === " " ) {
                        RecipeInfo.recipeURL = errMsg;
                }else{
                    RecipeInfo.recipeURL = recipeResults[i].sourceUrl;
                }

                //Get Image URL
                console.log("Image URL: " + recipeResults[i].image);
                if (recipeResults[i].image === "undefined" || recipeResults[i].image === " " ) {
                        RecipeInfo.imageURL = errMsg;
                }else{
                    RecipeInfo.imageURL = recipeResults[i].image;
                }

                //Push the object to recipeResultArray
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
        html += "<div class = 'save-recipe'><a class='waves-effect pink darken-4 btn-flat' data-recipeTitle ='" + value.recipeTitle + "' data-recipeURL = '" +  value.recipeURL + "'>+ SAVE</a></div>";
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

// This function pulls saved recipes from database for the logged in user and write it to the saved recipes tab
function getSavedRecipes(currUser){

    //Fetch the saved recipes for the specific user
    databaseRef.ref().child('users').orderByChild('userName').equalTo(currUser).once("value", function(snapshot){
        //usersRef.orderByChild('jincy').once("value", function(snapshot){
        console.log(snapshot.val());

        console.log(snapshot.child(currUser).val().savedRecipes);
    });
    

}


//--------------------------------------------------------------------------------------
//--------------------------MAIN PROCESS------------------------------------------------

//------------------------ON DOCUMENT LOAD----------------------------------------------

$(document).ready( function(){

    var userArray = ["jincy", "jamie", "mathew", "kathleen"];
    var recipeInfoArray1 = [
                            {recTitle: "recipe1", recURL: "recipeURL1"},
                            {recTitle: "recipe2", recURL: "recipeURL2"},
                            {recTitle: "recipe3", recURL: "recipeURL3"},
    ];
    var recipeInfoArray2 = [
                            {recTitle: "recipe1", recURL: "recipeURL1"},
                            {recTitle: "recipe2", recURL: "recipeURL2"},
                            {recTitle: "recipe3", recURL: "recipeURL3"},
    ];

    var recipeInfoArray3 = [
                            {recTitle: "recipe1", recURL: "recipeURL1"},
                            {recTitle: "recipe2", recURL: "recipeURL2"},
                            {recTitle: "recipe3", recURL: "recipeURL3"},
    ];
    var recipeInfoArray4 = [
                            {recTitle: "recipe1", recURL: "recipeURL1"},
                            {recTitle: "recipe2", recURL: "recipeURL2"},
                            {recTitle: "recipe3", recURL: "recipeURL3"},
    ];

    var userInfoArray = [
                    {userName: "jincy", savedRecipes: recipeInfoArray1},
                    {userName: "jamie", savedRecipes: recipeInfoArray2},
                    {userName: "mathew", savedRecipes: recipeInfoArray3},
                    {userName: "kathleen", savedRecipes: recipeInfoArray4}
    ];

    console.log("Write to database");

    //Write to databse for first time
/*
    for(i=0; i<userArray.length; i++){

        var myUser = usersRef.child(userArray[i]);
        myUser.set({
                userName: userArray[i],
                savedRecipes: recipeInfoArray1
        });

    }*/

    var searchUser = "jincy";
    //update records already in the database
    var newRecipe = {recTitle: "recipe4", recURL: "recipeURL4"};
     databaseRef.ref().child('users').orderByChild('userName').equalTo(searchUser).once("value", function(snapshot){
        //usersRef.orderByChild('jincy').once("value", function(snapshot){
        console.log(snapshot.val());

        console.log(snapshot.child(searchUser).val().savedRecipes);

        var savedRecipeArray = snapshot.child(searchUser).val().savedRecipes;
        savedRecipeArray.push(newRecipe);

        console.log(savedRecipeArray);

        var currUserRef = usersRef.child(searchUser);

        currUserRef.set({
                userName: searchUser,
                savedRecipes: savedRecipeArray
        });



    });

      

});

//----------------------------------------------------------------------------------------------------
//----------------------------------------LOGIN - ON CLICK -------------------------------------------
//Capture Username From User Input and also load the saved recipes from the database//

$("#user-login").on("click", function(event){

    event.preventDefault();

    usernameEntered = $(".unEntered").val().trim();

    //Check if user exists in database, If not display an error and ask to login again

    //Display username along with "What's in your Pantry"
    $("#displayMember").html(", "+ usernameEntered);

    // Pull saved recipes from database for the logged in user and write it to the saved recipes tab
    getSavedRecipes(usernameEntered);

});

//----------------------------------------------------------------------------------------------------
//----------------------------------------Spoonacular API call----------------------------------------


// This .on("click") function will trigger the AJAX Call
$("#find-recipe").on("click", function(event) {

    // Preventing the submit button from trying to submit the form
    console.log("Button clicked");
    // We're optionally using a form so the user may hit Enter to search instead of clicking the button
    event.preventDefault();    

    //Here we grab the text from the input box for number of recipes entered by user
    numRecipesToReturn= $("#numOfRecipes").val().trim();
    console.log(numRecipesToReturn);

    // Here we grab the text from the input box
    //var recipe = $("#recipe-input").val();
    // Here we grab the text from the input box
    var recipe = $("#recipe-input").val().trim();

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
    queryURL = queryURL + "limitLicense=false";

    //number: The maximal number of recipes to return (default = 5).
    queryURL = queryURL + "number=" + recipeCount + "&";

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

});

//When save recipe button is clicked, notify the user and save recipe to the database
$("#recipes-container").on("click",".save-recipe", function(event){
   // Materialize.toast(message, displayLength, className, completeCallback);
    Materialize.toast('Recipe saved!', 3000);
  
});








