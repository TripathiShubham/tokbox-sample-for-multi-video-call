
var express =require('express');
var path = require('path');
var app =express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var OpenTok = require('opentok');
var cors = require('cors')

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

var sessionList = [];

var apiKey ='';
var apiSecret = '';

var opentok = new OpenTok(apiKey, apiSecret);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

app.use('/client',express.static(__dirname + '/client'));
app.get('/',function (req,res) {
   res.sendFile(path.join(__dirname + '/client/index.html'));
});


io.on('connection', function(socket) {
 console.log("Socket is "+ socket + " Socket ID is "+ socket.id);
    socket.on('newClientSession', function(data) {

    });
});

app.get('/session',function (req,res) {
    console.log("get/session..................");

    opentok.createSession({mediaMode:"routed"}, function(err, session) {
  if (err) return console.log(err);

var sessionid = session.sessionId;
    io.emit('newClientConnected', sessionid);
  sessionList.push(session);
  console.log(sessionList);
var token = session.generateToken();

var responseObj = {"session": sessionid,"apiKey":apiKey,"token":token};
console.log(responseObj);
res.json(responseObj);

});




});

app.post('/dashboard',function (req,res) {
    console.log("post/dash...................................");

    console.log("req.bparams....:  "+req.params.sessionId);

    console.log("req.body..."+req.body.sessionId);

   var sessionI = req.body.sessionId  ;

  var token = opentok.generateToken(sessionI);

   res.json({"apiKey" :apiKey,"token":token});
});


var port = process.env.PORT || 3001;
http.listen(port);
console.log('Started on port '+ port);
