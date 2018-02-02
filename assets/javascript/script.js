
$(document).ready( function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD22TAbRUf6_X5RJgd02MZ7DyCl2krNJ34",
    authDomain: "trainscheduler-c0f3f.firebaseapp.com",
    databaseURL: "https://trainscheduler-c0f3f.firebaseio.com",
    projectId: "trainscheduler-c0f3f",
    storageBucket: "trainscheduler-c0f3f.appspot.com",
    messagingSenderId: "983277076514"
  };
  firebase.initializeApp(config);
 
  var database = firebase.database();

  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    //get the stuff from the database
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTime = childSnapshot.val().firstTime;
    var frequency = childSnapshot.val().frequency;
    //console.log("First Time : "+firstTime);
    // take a moment to reflect!
    var difference = moment().diff(moment.unix(firstTime, "X"), "minutes");
    var timePassed = difference % frequency;
    var minutesAway = frequency-timePassed;
    var nextArrival = moment().add(minutesAway,"minutes").format("hh:mm A");
    //display on the screen
    $("#tableBody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
      frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");

  }, function(errorObject){
    console.log("The read failed: "+ errorObject.code);
  });

  $("#submitButton").on("click", function(event){
    event.preventDefault();
    //update the database with the new informations!!
    var name = $("#trainName").val().trim();
    var dest = $("#destination").val().trim();
    var freq = $("#frequency").val().trim();
    var firstT = moment( $("#firstTrainTime").val().trim(), "hh:mm").subtract(1,"days").format('X');
    //clear out the input space
    $("#trainName").val("");
    $("#destination").val("");
    $("#frequency").val("");
    $("#firstTrainTime").val("");
    var newTrain={
      trainName   : name,
      destination : dest,
      firstTime   : firstT,
      frequency   : freq
    };
    
    database.ref().push(newTrain);
  });

});
