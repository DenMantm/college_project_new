

module.exports = 
    function(socket,server){
        var clients = {};
var io = require('socket.io').listen(server);
io.on("connection",function(){
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
});
	return clients;
}
    
    


