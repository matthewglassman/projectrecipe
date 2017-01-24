
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBTpL9H71mW7K0DqiuPlNO0DdVMxsQt0gc",
    authDomain: "authenticationtest-993d6.firebaseapp.com",
    databaseURL: "https://authenticationtest-993d6.firebaseio.com",
    storageBucket: "authenticationtest-993d6.appspot.com",
    messagingSenderId: "483424001248"
  };
  firebase.initializeApp(config);

var database = firebase.database();

var gotNumber = [];

//Get elements
// email = document.getElementById('email');
// password = document.getElementById('password');
// login = document.getElementById('login');
// logout = document.getElementById('logout');

//Add login event
$("#login").on("click", function(event){
	//event.preventDefault();
	//get email and password
	useremail = $("#email").val().trim();
	userpassword = $("#password").val().trim();
	//alert("test");
	var auth = firebase.auth(); //the firebase authentication method

	//Sign in
	auth.signInWithEmailAndPassword(useremail, userpassword).catch(function(error){
		var errorCode = error.code;
		var errorMessage = error.message;

		console.log("Problem: " + errorCode + " Message: " +errorMessage);
	}).then(function(success){
		console.log("Logged In", success);
		//Clear out number and numbershow
		$("#numbershow").empty();
		// $("#number").empty();
		$("#number").text("")
	});
});

//Log Out functionality
$("#logout").on("click", function(event){
	firebase.auth().signOut();
	$("#numbershow").hide();
});

//Add Sign Up Event
$("#signup").on("click", function(event){
//event.preventDefault();
	//get email and password
	useremail = $("#email").val().trim();
	userpassword = $("#password").val().trim();
	//alert("test");
	var auth = firebase.auth(); //the firebase authentication method
	$(".error").text("");
	//Sign in
	 creation = auth.createUserWithEmailAndPassword(useremail, userpassword).catch(function(error){
		 errorCode = error.code;
		 errorMessage = error.message;
		  if (errorCode.indexOf('invalid')){
		 	$("#email + .error").text('This email is invalid')
		 }
		  else if (errorCode.indexOf('in-use')){
		 	$("#email + .error").text('This email is already in use')
		 }
		  if (errorCode.indexOf('weak')){
		 	$("#password + .error").text('This password is not strong')
		 }

		 	// if(errorCode){
		 	// 	alert("pushed it real good");
		 	// 	database.ref().push({
		 	// 		User: useremail
		 	// 	});
		 	//};

		console.log("Problem: " + errorCode + " Message: " +errorMessage);
	}).then(function(success){
		console.log("Look at Me", success);
	});

//Capture user email to the database
// if (errorCode === "false"){
// 	database.ref().push({
// 		User: useremail
// 	});
// };
// database.ref().push({
//         User: useremail
//       });

});

//Add realtime listener to catch authorization state change
firebase.auth().onAuthStateChanged(function(firebaseUser){
	if(firebaseUser != null) {
		//console.log(firebaseUser);
	//var user = firebase.auth().current;
	//var email;
	//@console.log(user);
	
		email = firebaseUser.email;
		console.log(email);
		$("#loggedinuser").show();
		$("#logout").show();
		$("#numbertest").show();
		$("#signup").hide();
		$("#login").hide();
		$("#email").hide();
		$("#password").hide();
		$("#loggedinuser").html(email);
		$("#numbershow").show();
	} else {
		console.log('not logged in');
		$("#logout").hide();
		$("#numbertest").hide();
		$("#number").text("");
		$("#signup").show();
		$("#login").show();
		$("#email").show();
		$("#password").show();
		$("#loggedinuser").hide();
		$("#numbershow").hide();
	}
});

$("#numberadd").on("click", function(event){
	event.preventDefault();
	gotNumber = $("#number").val().trim();
	$("#numbershow").text(gotNumber);

//capture logged in user and numbers entered
	currentUser = $("#loggedinuser").val().trim();
	addNumber = $("#number").val().trim();

	database.ref().push({
	User: email,
	number: addNumber				
	});
});

database.ref().on("value", function(snapshot) {
	 for (var key in snapshot.val()){ 
	  //console.log(snapshot.val());
      console.log(snapshot.val()[key].User);
      console.log(snapshot.val()[key].number);
  };
}, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
});