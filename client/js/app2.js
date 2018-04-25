var apiKey,
    sessionId,
    token,
    subscriber,
    no_of_user = 1;

var socket = io();

socket.on('newClientConnected', function(sessionId) {
  var txt = sessionId;
   $.post('/dashboard', {sessionId : txt},function(res) {
    apiKey = res.API_KEY || res.apiKey ;
    sessionId = txt;
    token = res.token ||  res.tokenOption_PUBLISHER ;             //token;

    console.log("your apiKey : "+apiKey);
    console.log("Your sessionId : "+sessionId);
    console.log("your token : "+token)

    var li = document.createElement('li');
    var div = document.createElement('div');
     subscriber = "subscriber"+no_of_user;
    no_of_user++;
    div.setAttribute('id', subscriber);
    div.setAttribute('class', 'subscriberVideo');
    li.appendChild(div);
    document.getElementById('userList').appendChild(li);

    initializeSession();
  });

  function initializeSession() {
  console.log(apiKey+"-------------"+sessionId);
  var session = OT.initSession(apiKey, sessionId);
  console.log(session);

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
    console.log(event);
    session.subscribe(event.stream, subscriber, {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    });

    console.log("subscriber......is calling ap2");
  });

  session.on('sessionDisconnected', function(event) {
    console.log('You were disconnected from the session.', event.reason);
  });

  // Connect to the session
  session.connect(token, function(error) {
      if (!error) {
          var pubOptions = {videoSource: null};
      var publisher = OT.initPublisher('audio', pubOptions);

      session.publish(publisher);
      console.log("Punblisher......is calling");
    } else {
      console.log('There was an error connecting to the session: ', error.code, error.message);
    }

  });
  

}
})

$(document).ready(function() {
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
 // var text = '1_MX40NTYyODQzMn5-MTQ3MDIxNDc5OTEzM34vWTJDL2VER2I2QXFPOW16c08zakRHNnd-fg';

});
