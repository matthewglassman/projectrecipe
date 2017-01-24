
//---------------------------------------------------------------------------------------
//----------------------------VARIABLES--------------------------------------------------
var errMsg = "Not Available";
var recipeResults = [];
var recipeResultArray = [];
var recipeCount = 10;
var search_ingredients = "oranges%2Cflour%2Cchicken";

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

//This function creates recipe cards for each recipe in the recipe results array
function createRecipeCards(){

    $.each(recipeResultArray, function( index,   value ) {



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
    var ingredObject = {
                        amount: 0,
                        unit: "",
                        name: ""
    };

    for (var i = 0, j = inputArray.length; i < j; i++) {
        //Add check for undefined
            ingredObject.amount = inputArray[i].amount.toFixed(1);
            ingredObject.unit = inputArray[i].unitLong;
            ingredObject.name = inputArray[i].name;

            //ingredArray[i] = inputArray[i].amount + inputArray[i].unitLong + " " + inputArray[i].name;
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


//--------------------------------------------------------------------------------------
//--------------------------MAIN PROCESS------------------------------------------------

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

//-------------------------------------------------

//Spoonacular API call
// This .on("click") function will trigger the AJAX Call
$("#find-recipe").on("click", function(event) {

    // Preventing the submit button from trying to submit the form
    console.log("Button clicked");
    // We're optionally using a form so the user may hit Enter to search instead of clicking the button
    event.preventDefault();    

    // Here we grab the text from the input box
    //var recipe = $("#recipe-input").val();
    // Here we grab the text from the input box
    var recipe = $("#recipe-input").val();

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

//When save recipe button is clicked, notify the user and save recipe to the databse
$("#recipes-container").on("click",".save-recipe", function(event){
   // Materialize.toast(message, displayLength, className, completeCallback);
    Materialize.toast('Recipe saved!', 3000);
  
});








