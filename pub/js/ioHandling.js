var socket = io.connect('/');

//converting value to string
var user = <%- JSON.stringify(user.local.email) %>;
console.log(user);

//on connect informs
socket.on("connect",function(){
	console.log('connected');
	socket.emit('add-user', user);
	checkConnections();
});

//listens for disconnection
socket.on("disconnect",function(){
	console.log('disconnected');
});

socket.on('clientList',function(userList){
	console.log(userList);
var keys = Object.keys(userList);
	console.log(keys);
})

var checkConnections = function(){
	socket.emit('user-list');
}

socket.on('update-list',function(list){
	//transfering object into list of users


console.log('working');
var keys = Object.keys(list);
    	var div = document.createElement("div");
    	var element = document.getElementById("user_list_small");
    	element.innerHTML = '';
    	for(var i = 0; i <keys.length;i++){
    		
var para = document.createElement("h4");
var node = document.createTextNode(keys[i]);
para.appendChild(node);
div.appendChild(para);



    	}
element.appendChild(div);

});
//~~~~~~~~~~~~~~~~~~~For Chat~~~~~~~~~~~~~#

var sendMessage = function(){
//assemble JSON to send
var chatmsg = {};
chatmsg.user = user;

chatmsg.message = document.getElementById('chatMessage').value;

socket.emit('messageToAll', chatmsg);
document.getElementById('chatMessage').value = '';
};

socket.on('chatIncomingMessage',function(msg){
	addMessage(msg);
});

//variable for different color messages
var state;
				


				//if we would get the message, fire this one

				
var addMessage = function(messageObject){

	//var elementt = document.getElementById("chat_small");

	var div = document.createElement("div");

	var user = document.createElement("h6");
	var message = document.createElement("h6");

	var userText = document.createTextNode(messageObject.user + ':');
	var messageText = document.createTextNode(messageObject.message);


	user.appendChild(userText);
	message.appendChild(messageText);

	user.className = 'userName';
	message.className = 'chatMessage';

	div.appendChild(user);
	div.appendChild(message);

	if(state){
	div.className = 'chatMessage1';
	state = false;
	}
	else{
	div.className = 'chatMessage2';
	state = true;
	}


	$("#chat_small").prepend(div);
	//elementt.prependChild(div);
};





