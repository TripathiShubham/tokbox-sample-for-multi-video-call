var apiKey,
    sessionId,
    token,
    key,
    value,
    sess,
    conn;

$(document).ready(function() {
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
//  $.get('/session', function(res) {
$.get('http://192.168.0.102:8080/security/chaperoneme/session/919949214452', function(res) {

 // console.log(res[45628542]);
 //   key = i;
 // for(var i in res[45628542]) {
 //   value = res[45628542][i];
//  }


console.log(res);
apiKey = res["apiKey"];
console.log(apiKey);
sessionId = res["sessionID"];
console.log(sessionId);
token = res["token"];
console.log(token);

  // apiKey = '45628542';
  // sessionId = key;
  // token = value;

   console.log("your apiKey : "+apiKey);
   console.log("Your sessionId : "+sessionId);
   console.log("your token : "+token)

   var session = OT.initSession(apiKey, sessionId);
   sess = session;
   console.log(session.id);
  session.on("signal", function(event) {
       console.log(event);
       alert(event.data+ "-----"+event.from+"----"+event.from.id);
       if(event.from.id == sessionId) {
         console.log("session id's are same");
       }
       // Process the event.data property, if there is any data.
     });

   // Subscribe to a newly created stream
   session.on('streamCreated', function(event) {
     var sub = session.subscribe(event.stream, 'subscriber', {
       insertMode: 'append',
       width: '100%',
       height: '100%'
     });
	 console.log(sub);
	sub.setAudioVolume(1);
/*	sub.setStyle('audioLevelDisplayMode', 'off');
	var movingAvg = null;*/
	sub.on('audioLevelUpdated', function(event) {
		console.log(event.audioLevel);
	});
   });

   session.on('sessionDisconnected', function(event) {
     console.log('You were disconnected from the session.', event.reason);
   });

   session.on("connectionCreated", function(event) {
     if(event.connection.connectionId != session.connection.connectionId) {
       conn = event.connection;
     }
   });
   // Connect to the session
   session.connect(token, function(error) {
     // If the connection is successful, initialize a publisher and publish to the session
     if (!error) {
       var publisher = OT.initPublisher('publisher', {
         name: 'Shubham -919515114916',
         style: {buttonDisplayMode: 'on'},
         insertMode: 'append',
         width: '100%',
         height: '100%',
		 frameRate: 30,
		 resolution: '1280x720'
       });

       session.publish(publisher);
       console.log("Punblisher......is calling");
     } else {
       console.log('There was an error connecting to the session: ', error.code, error.message);
     }
   });
  });
});

var sendmesg = function() {
  sess.signal(
 {
   to: conn,
   data:"hello this is message from mobile..."
 },
 function(error) {
   if (error) {
     console.log("signal error ("
                  + error.code
                  + "): " + error.message);
   } else {
     console.log("signal sent.");
   }
 }
);
}
