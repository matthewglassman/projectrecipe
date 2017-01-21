
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
	});
});

//Log Out functionality
$("#logout").on("click", function(event){
	firebase.auth().signOut();
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
	var email;
	//@console.log(user);
	
		email = firebaseUser.email;
		console.log(email);
	
		$("#logout").show();
		$("#signup").hide();
		$("#login").hide();
	} else {
		console.log('not logged in');
		$("#logout").hide();
		$("#signup").show();
		$("#login").show();
	}
});
