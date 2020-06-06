var express = require('express');
var createError = require('http-errors');
var router = express.Router();

let client = require('../db');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

//Pass redirect string back and serve up login page.
router.get('/', function(req, res, next) {	
	let redirect = req.query.redirect;
	if(redirect==null){
		redirect = "";
	}

	res.render('login', {remarks: "", username: "", password: "", redirect : redirect});
});

router.post('/', function(req, res, next) {
	let {username, password, redirect} = req.body;
	if(redirect==null){
		redirect = "";
	}


	if(username==null || password==null){
		next(createError(400));
		return;
	}
	//Check password accuracy
	attemptLogin(username, password)
	.then(() => {
		//Authentication successful

		//Generate jsonwebtoken
		let currDate = new Date();
		let laterEpoch = currDate.getTime() + 2*60*60*1000; //verify

		let payload = { "exp" : laterEpoch , username : username };
		let secret = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
		let options = { header :{ "alg": "HS256", "typ": "JWT"	}}; //HS256 is default alg
		let token = jwt.sign(payload, secret, options);
		//console.log(token);
		//Send success message
		res.status(200);
		res.cookie("jwt",token,{ httpOnly : false });
		if(redirect==""){
			res.send({message : "Login successful."});
		} else {
			res.redirect(redirect);
		}
	})
	.catch(() =>{
		//Wrong credentials
		res.status(401);
		res.render('login', 
			{remarks : "Login unsuccessful. Try again.", 
			username: username, password: password,redirect: redirect}
		);
	});
});


async function attemptLogin(username, password){
	let users = client.db('BlogServer').collection('Users');

	let userdata = await users.findOne({username : username});

	if(userdata==null){
		console.log("User does not exist.");
		throw Error("User does not exist.");
	}
	
	let correctPassword = await bcrypt.compare(password, userdata.password);
	
	if(correctPassword){
		return true;
	} else {
		console.log("Incorrect password.");
		throw Error("Incorrect password.")
	}
}

module.exports = router;
