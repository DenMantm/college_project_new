// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express'),
 xslt     = require('node_xslt'),
 app      = express(),
 port     = process.env.PORT || 3001,
 mongoose = require('mongoose'),
 passport = require('passport'),
 flash    = require('connect-flash'),
 http     = require('http'),
 path     = require('path'),
 ioReal       = require('socket.io'),
 configDB = require('./db'),
 reg      = require('./engine/regsocket');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./passport')(passport); // pass passport for configuration

app.configure(function() {
	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating
	app.set('port', port);
	// required for passport
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
	app.use(express.static(path.join(__dirname, 'pub')));
});


     //FOR POST XML REQUESTS BODY PARSER

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


//array for users
var clients = {};
function handleIO(socket){
	
	//adding user to list
	socket.on('add-user', function(data){
		//writing to the object
    clients[data] = {
      "socket": socket.id,
      'name': data
    };
                     //if user connects, provide him with userlist and others as well
    socket.broadcast.emit('update-list',clients);
    socket.emit('update-list',clients);

  });
					//handling Small Chat window::



					socket.on('messageToAll',function(msg){
						    socket.broadcast.emit('chatIncomingMessage',msg);
    						socket.emit('chatIncomingMessage',msg);
    					
					})

				socket.on('inviteUser',function(invite){
					
					if(clients[invite.user]===undefined){
						socket.emit('inviteStatus','noUser');
						return;
					}
					//sending request to certain person::
					console.log('USER TO INVITE: '+ clients[invite.user].socket);
					console.log(invite);

					//send invite to the user
					io.to(clients[invite.user].socket).emit("invite", invite);

					socket.on('inviteStatusFromUser',function(answer){
						if(answer.type ==='accept'){
							console.log('accepting');
						io.to(clients[answer.user].socket).emit('inviteStatus','accept');
						return;
						}
						if(answer.type === 'reject'){
							console.log('reject');
						io.to(clients[answer.user].socket).emit('inviteStatus','reject');
						return;
						}
					});	
					
					
				})       
			
				
	                 //when requireing userlist presenting it

	socket.on('user-list',function(){
		                   //if new user connects, emmit userlist
		socket.emit('update-list',clients);
		console.log('working');
	});

					//Handling Disconnection::
	
	function disconnect(){
		//finding which user disconnected
		for (var key in clients) {
	if(clients[key].socket === socket.id){
		console.log(key);
		//deleting that entry
		delete clients[key];
	}
 
	}
		socket.broadcast.emit('update-list',clients);
	};

	console.log("connected");
	//whenever client disconnected
	socket.on("disconnect",disconnect);
}

var server = app.listen(port);
var io = require('socket.io').listen(server);
//requireing debug messages to go away
//io.set('log level', 1);
//event listner on connection fires funct
io.on("connection",handleIO);

// routes ======================================================================
require('./roots')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================

console.log('Express server listening on port ' + app.get('port'));

