//first start init with firebase 
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDjD05ntWCf-Ww_TdGeCa9_JhfEc_tbUh4",
  authDomain: "project1-8d4f2.firebaseapp.com",
  databaseURL: "https://project1-8d4f2.firebaseio.com",
  projectId: "project1-8d4f2",
  storageBucket: "project1-8d4f2.appspot.com",
  messagingSenderId: "933735402646"
};

firebase.initializeApp(config);

//check if user is login 
initApp = function () {
  firebase.auth().onAuthStateChanged(
    function (user) {
      if (user) {

        /* site logic start here */

        $(document).ready(function () {
          //global variables
          var resultBeers;

          //event listener to fire up the search and acces the API
          $("#search-button").on("click", function (event) {
            //prevent reloads
            event.preventDefault();
            //hiding the jumbotron to full display the table list-beers
            $(".jumbotron").hide();
            //clear the current content of the table
            $("#list-beers").empty();

            // get the content of the input
            var searchInput = $("#search-input").val().trim();
            console.log(searchInput);

            //trying to connect to the API in the sandbox  
            //build the query
            // example endpoint beers:::> http://api.brewerydb.com/v2/{endpoint}/?key=abcdef
            var queryURL = "https://cors-anywhere.herokuapp.com/https://sandbox-api.brewerydb.com/v2/search?key=c0a5fceb48f0e2d48f8850e64307b88f&q=" + searchInput;

            /* Important do not touch
            var queryURL = "https://cors-anywhere.herokuapp.com/https://sandbox-api.brewerydb.com/v2/search?key=c0a5fceb48f0e2d48f8850e64307b88f&q=guinness";
             */

            // Creates AJAX call for the specific  button being clicked
            $.ajax({
              url: queryURL,
              method: "GET"
            }).then(function (response) {
              //console.log(response);


              //if the AJAX call returns something 
              if (response.data.length && response.data.length > 0) {

                console.log(`length: ${response.data.length}`);
                //get the results as a giant resultsBeers Object
                resultBeers = response.data;
                console.log(resultBeers);

                //display the number of beers found in the card title
                $("#number-results").text(resultBeers.length);

                //get the id of the returned beers to create a second query to get specific information about the selected beer

                /*  var beerId = resultBeers[2].id.trim();
                 console.log(`Beer Id:${beerId}`); */

                //for loop to create the table results content\
                for (var i = 0; i < resultBeers.length; i++) {

                  //local variables to get store the data
                  var id = resultBeers[i].id.trim();

                  //testId
                  testId = id;
                  var name = resultBeers[i].name;
                  var type = resultBeers[i].type;

                  //inline if statement to check if established exists 
                  var established = ((resultBeers[i].established) ? resultBeers[i].established : "Not available");

                  //inline if statement to check if category exists
                  var category = ((resultBeers[i].style) ? resultBeers[i].style.name : "Not available");

                  //create a new row using jQuery and 
                  var newRow = $("<tr>");
                  newRow.attr("data-id", id);
                  newRow.attr("data-name", name);
                  //!!!really crazy part stay with me :)
                  //its gonna get really really nasty

                  // Using the data method:          
                  newRow.data("abv", resultBeers[i].abv);
                  newRow.data("desc", resultBeers[i].description);
                  newRow.data("isOrganic", resultBeers[i].isOrganic);
                  newRow.data("isRetired", resultBeers[i].isRetired);
                  //from one result to another image links are store either under labels or images
                  var imgSrc;
                  if (resultBeers[i].labels) {
                    imgSrc = resultBeers[i].labels.medium;
                  } else {
                    if (resultBeers[i].images) {
                      imgSrc = resultBeers[i].images.medium;
                    }
                  }
                  //second query moved into inside the event listener for a click on the table import  
                  //still passing data to data method()
                  newRow.data("image", imgSrc);
                  //inline statement to get fill the data
                  newRow.data("availability", ((resultBeers[i].available) ? resultBeers[i].available.name : "Not data available"));

                  newRow.data("availability-desc", ((resultBeers[i].available) ? resultBeers[i].available.name.description : "Not data available"));

                  var rowName = $("<td>").text(name).appendTo(newRow);
                  var rowType = $("<td>").text(type).appendTo(newRow);
                  var rowEstablished = $("<td>").text(established).appendTo(newRow);
                  var rowCategory = $("<td>").text(category).appendTo(newRow);
                  //append the newRow to the table list-results
                  $("#list-beers").append(newRow);


                }

              } else { // in case there no data available for the search input
                //display the number of beers found in the card title
                $("#number-results").text("No data available");
              }
            });
          });

          //event listener for a click on a table tr on list-beers 
          $(document).on("click", "#list-beers tr", function () {
            //change the color of the row
            $(this).addClass("table-success");

            //get the value of the tr id
            var rowId = $(this).attr("data-id");
            var rowName = $(this).attr("data-name")
            alert(`this beer is: ${rowName}`);

            //remember the data method lol.
            //here is the time to call it back. Razen Sharingan!!! 
            var abvValue = $(this).data("abv");
            var descValue = $(this).data("desc");
            var isOrganicValue = $(this).data("isOrganic");
            var isRetiredValue = $(this).data("isRetired");
            var availabilityValue = $(this).data("availability");
            var availabilityDescValue = $(this).data("availability-desc");
            /* DESCRIPTION */
            //NAV 1 - display the values inside the nav description
            //but first clean the current content tada...
            $("#nav-description").text("");

            //later will build some css for better render
            var divDescription = $("<div>");

            var pDescription = $('<p class="lead">').text(descValue);
            var hAbv = $("<h4>").text("Alcohol Content: " + abvValue);
            var hisOrganic = $("<h4>").text("Is organic: " + isOrganicValue);
            var hisRetired = $("<h4>").text("Is retired: " + isRetiredValue);
            var havailabilityValue = $("<h4>").text("Availability: " + availabilityValue);
            var havailabilityDescValue = $("<h4>").text("Availability : " + availabilityDescValue);

            //append everything to the div
            divDescription.append(pDescription, hAbv, hisOrganic, hisRetired, havailabilityValue, havailabilityDescValue)

            //append the div to the nav description
            $("#nav-description").append(divDescription);

            /* IMAGE */
            //NAV 2 - display image of the beer
            //clear the current content
            $("#nav-image").empty();
            //lets build the img tag
            //get the value back from data
            var imageSrc = $(this).data("image");
            //create the img tag
            var imgTag = $("<img>");

            imgTag.addClass("") // class img thumbnail
              .attr("src", imageSrc) // img src
              .attr("alt", imageSrc); // alt
            $("#nav-image").append(imgTag);


            /* CALORIES */
            //NAV 3 - display calories

            //empties nav nutrtion to prevent stacking information from previous searches
            $("#nav-nutrition").empty();
            /* Calorie Search starts here */
            //search is based on the beer name so we will use rowName

            //var searchInput = $("#search-input").val().trim();
            console.log(rowName);

            var calorieQuery = "https://trackapi.nutritionix.com/v2/search/instant?query=" + rowName;
            $.ajax({
              url: calorieQuery,
              method: "GET",
              headers: {
                "x-app-id": "87764d56",
                "x-app-key": "64b0113675aca1dbf6f67d9df8299556"
              }
            }).then(function (responseCalories) {
              console.log(responseCalories);
              //display beer calories for first result
              var beerCalorie = responseCalories.branded[0].nf_calories;
              var servingSize = responseCalories.branded[0].serving_qty + responseCalories.branded[0].serving_unit;

              //passing the values of calories to data
              //newRow.data("calorie", beerCalorie);
              //newRow.data("serving", servingSize);

              //create the div Tags
              var calorieTag = $("<div>");
              var servingTag = $("<div>");

              //building the html tag
              calorieTag.html("<h4>Calories:</h4>" + beerCalorie);
              servingTag.html("<h4>Serving size:</h4>" + servingSize);

              //append the divs to the nav 
              $("#nav-nutrition").append(calorieTag, servingTag);
            });

            // get the nutrition and serving size back from data
            //var calorieValue = $(this).data("calorie");
            //var servingValue = $(this).data("serving");

            /*INGREDIENTS  */
            //NAV 4  - display the values of the ingredients
            $("#nav-ingredients").empty();
            //parameters :::> beer/WHQisc/ingredients
            // testId = "WHQisc"; 
            //change later by rowId 
            var testId = rowId;
            var queryBeer = "https://cors-anywhere.herokuapp.com/https://sandbox-api.brewerydb.com/v2/beer/" + testId + "/ingredients?key=c0a5fceb48f0e2d48f8850e64307b88f";
            //creates the AJAX call for the specific beerId aka rowId
            $.ajax({
              url: queryBeer,
              method: "GET"
            }).then(function (beerIngredients) {
              console.log(beerIngredients);
              if (beerIngredients.data) {
                var listIngredients = beerIngredients.data.length;
                var ingredientDiv = $("<div>");
                //for loop to create the ingredients tag
                for (var j = 0; j < listIngredients; j++) {
                  console.log(`Ingredient - ${j} - ${beerIngredients.data[j].name}`);
                  //create an h4 tag and append it to ingredientDiv
                  var ingredientTag = $("<h5>").text(`Ingredient - ${j} - ${beerIngredients.data[j].name}`).appendTo(ingredientDiv);
                }
                //dipslay the ingredient content inside the nav-ingredients
                $("#nav-ingredients").append(ingredientDiv);
              } else {

                $("#nav-ingredients").text("No data available!");
              }
              //console.log(`length: ${response.data.length}`);      
            });

          });
        });
        /* site logic ends here */
      } else {
        // User is signed out.
        window.location.replace('index.html')
      }
    },
    function (error) {
      console.log("Auth error:"+ error);
    }
  );
};