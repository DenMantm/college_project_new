	//required to transform
	var xslt_transform = require('../engine/xslt_transform.js'),
	            tryxml = require('../engine/xml_save.js'),
	            fs = require('fs');

module.exports = function(app, passport) {

		app.get('/', isLoggedIn, function(req, res) {

		res.render('shell.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
			
			//XML HANDLING 
	
	app.post('/sendMessageToUser', function(req, res) {

    var message = req.body.message;
    console.log(message);
    var paths_sender = './xmlStorage/'+req.user.local.email+'.xml';
    var paths_reciever = './xmlStorage/'+message.user+'.xml';

    console.log(paths_sender);
    console.log(paths_reciever);

        fs.exists(paths_reciever, function(exists){
        if (exists) {
		
    tryxml('sent',        paths_sender,     message.to_user,            message.message);
    tryxml('recieved',    paths_reciever,   req.user.local.email,       message.message);
    res.send('success');
         }
          else{
		res.send('noFile');

}

}); 
        
 
});
    
			//XSLT return to the user ON REQUEST
			
		app.get('/sent', isLoggedIn, function(req, res) {
		var paths = './xmlStorage/'+req.user.local.email+'.xml';
		var transform = './xsltStorage/sent.xsl';
		res.send(xslt_transform(transform,paths));

		
	});
	
			app.get('/recieved', isLoggedIn, function(req, res) {
		var paths = './xmlStorage/'+req.user.local.email+'.xml';
		var transform = './xsltStorage/recieved.xsl';
		res.send(xslt_transform(transform,paths));

		
	});
			//RETURNING SENDING FORM
			
	app.get('/sendMessage', isLoggedIn, function(req, res) {
		res.render('sendMessage.ejs');
	});
			
	
			//RETURNS cardGame1

			app.get('/cardGame1', isLoggedIn, function(req, res) {

		res.render('cardGame1.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

			//returns parts of the page
		app.get('/profile', isLoggedIn, function(req, res) {
		res.render('prof.ejs');
	});
		app.get('/maingame', isLoggedIn, function(req, res) {
		res.render('game.ejs');
	});

		app.get('/messages', isLoggedIn, function(req, res) {
		res.render('messages.ejs');
	});


		//socket io test
				app.get('/socket', isLoggedIn, function(req, res) {

				//var nickName = req.user;
				//nickName = nickName.local.email
				
		res.render('socket.ejs',{
			user : req.user // get the user out of session and pass to template
		});
	});



	app.get('/main', isLoggedIn, function(req, res) {
		console.log(req.user);
		res.render('main.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});


	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});


	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/login',
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/login');
}
