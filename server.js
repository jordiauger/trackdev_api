global.rootRequire = function(name) {
  return require(__dirname + '/' + name);
}

var express = require('express');
var http = require('http');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var methodOverride = require('method-override');
var serveStatic = require('serve-static');


var secret = '63?gdº93!6dg36dºb36%Vv57V%c$%/(!V497';

var app = express();

app.set('port', process.env.PORT || 3000)

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('combined'))
app.use(bodyParser.json());
app.use(function (error, req, res, next) {
  error.location = "ERROR_JSON_PARSE";
  error.code = 400;
  next(error);
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride());
app.use(cors());
app.use(serveStatic(path.join(__dirname, 'public'), {'index': ['index.html', 'index.htm']}));
app.use(function (err, req, res, next) {
  var code = err.code || 500;
    console.log(err.message)
  var json = {};
  json.type = err.type || "ERROR_UNKNOWN";
  json.name = err.name || "UNKNOWN";
  json.message = err.message || "Unknown error";
  json.stack = err.stack || "No stack trace available";
  res.status(code).send({
    error: json
  });
});

app.secret = secret;

app.Promise = require('bluebird');

app.db = require('./models')(app);

app.db.initPromise
  .then(function () {

    app.use(rootRequire('./routers/noAuthRouter')(app));
    app.use(rootRequire('./routers/authRouter')(app));

    var port = process.env.OPENSHIFT_NODEJS_PORT || app.get('port');
    var ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

      var server = http.createServer(app);

      /*var io = require('socket.io')(server);

      io.on('connection', function(socket) {

          socket.on('adduser', function(username,room){
              // store the username in the socket session for this client
              socket.username = username;
              // store the room name in the socket session for this client
              socket.room = room;
              // add the client's username to the global list
              //usernames[username] = username;
              // send client to room 1
              socket.join(room);
              // echo to client they've connected
              //socket.emit('updatechat', 'SERVER', 'you have connected to room1');
              // echo to room 1 that a person has connected to their room
              //socket.emit('messages',{text: "You have connected to room "+socket.room})
              //socket.broadcast.to(room).emit('messages', {text: username + ' has connected to this room'});
              //socket.emit('updaterooms', rooms, 'room1');
          });

          socket.on('switchRoom',function(newroom, username){
              // leave the current room (stored in session)
              socket.leave(socket.room);
              socket.username = username;
              // join new room, received as function parameter
              socket.join(newroom);
              socket.emit('messages',{text: "You have connected to game "+newroom})
              // sent message to OLD room
              socket.broadcast.to(socket.room).emit('messages', {text: socket.username + ' has left this game'});
              // update socket session room title
              socket.room = newroom;
              socket.broadcast.to(newroom).emit('messages', {text: socket.username+' has joined this game'});
              //socket.emit('updaterooms', rooms, newroom);
          })

          socket.on('new-message', function(message) {
              var data = {
                  author: socket.username,
                  text: message
              }
              socket.broadcast.to(socket.room).emit('messages', data);
              socket.emit('messages', data);
          });

          socket.on('disconnect', function () {
              socket.broadcast.to(socket.room).emit('messages', {text: socket.username + ' has disconnected from this game'});
          });

          socket.on('new-build', function(user_id,color,position,type){
              socket.broadcast.to(socket.room).emit('build',user_id,color,position,type);
          });

          socket.on('dice-play', function(diceResult){
              socket.broadcast.to(socket.room).emit('dice',diceResult);
              socket.emit('dice',diceResult);
              var data = {
                  text: 'Ha sortit un '+diceResult
              };
              socket.broadcast.to(socket.room).emit('messages', data);
              socket.emit('messages', data);
          });

          socket.on('end-turn', function(id1,id2,id){
              socket.broadcast.to(socket.room).emit('endturn',id1,id2,id);
              socket.emit('endturn',id1,id2,id);
              var data = {
                  author: socket.username,
                  text: 'El jugador amb id: '+id1+' ha acabat el torn. Torn del jugador amb id: '+id2
              };
              socket.broadcast.to(socket.room).emit('messages', data);
              socket.emit('messages', data);
          });

          socket.on('leave',function(){
              socket.leave(socket.room);
          })

          socket.on('end-game',function(){
              var data = {
                  text: 'El jugador '+socket.username+' ha guanyat la partida'
              }
              socket.broadcast.to(socket.room).emit('messages',data);
              socket.emit('messages',data);
          })

      });*/

      server.listen(port, ip, function () {
          console.log("Express server listening on " + ip + ":" + port);
      })

  }, function (err) {
    console.log("Error initializing database: " + err);
  })
  .done();
