var express = require('express');
var createError = require('http-errors');
var router = express.Router();

var jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');
let client = require('../db');

//Return all blog posts by username
router.get('/:username', function(req, res, next) {
	let username = req.params.username;

	let token = req.cookies.jwt;
	if(!validateUser(username, token)){
		next(createError(401));
		return;
	}

	getData(username)
	.then(data => {
		res.status(200);
		res.send(data);
	}).catch(() => next(createError(404)));
});

//Return blog post with postid
router.get('/:username/:postid', function(req, res, next) {	
	let username = req.params.username;
	let postid = parseInt(req.params.postid);

	let token = req.cookies.jwt;
	if(!validateUser(username, token)){
		next(createError(401));
		return;
	}

	if(isNaN(postid)){
		console.log("not a number.");
		next(createError(404));
		return;
	}

	getData(username, postid)
	.then(data => {
		res.status(200);
		res.send(data);
	}).catch(() => next(createError(404)));
});


router.post('/:username/:postid', function(req, res, next) {	
	let username = req.params.username;
	let postid = parseInt(req.params.postid);
	const {title, body} = req.body;

	let token = req.cookies.jwt;
	if(!validateUser(username, token)){
		next(createError(401));
		return;
	}
	console.log(req.body)
	console.log(title)
	console.log(body)
	//Bad request
	if(title==null || body==null){
		next(createError(400));
		return;
	}

	postData(username,postid, title, body)
	.then(()=>{
		res.status(201);
		res.send();
	})
	.catch(()=> next(createError(400)));

});

router.put('/:username/:postid', function(req, res, next) {
	let username = req.params.username;
	let postid = parseInt(req.params.postid);
	const {title, body} = req.body;

	let token = req.cookies.jwt;
	if(!validateUser(username, token)){
		next(createError(401));
		return;
	}

	//Bad request
	if(title==null || body==null || title==undefined || body==undefined){
		next(createError(400));
		return;
	}

	putData(username,postid, title, body)
	.then(()=>{
		res.status(200);
		res.send();
	})
	.catch(()=> next(createError(400)));

});

router.delete('/:username/:postid', function(req, res, next) {	
	let username = req.params.username;
	let postid = parseInt(req.params.postid);

	let token = req.cookies.jwt;
	if(!validateUser(username, token)){
		next(createError(401));
		return;
	}

	deleteData(username, postid)
	.then(()=>{
		res.status(204);
		res.send();
	})
	.catch(()=> next(createError(400)));
});



//delete post
async function deleteData(username, postid, title, body){
	let posts = client.db('BlogServer').collection('Posts');

	let data = await posts.find({username : username, postid : postid }).limit(1).toArray();
	if(data.length!=0){
		//Delete post
		await posts.deleteOne({username : username, postid : postid });
	} else {
		//Post does not exist
		await console.log("Post does not exist.");
		throw new Error('Post not found.');
	}
}

//update old post
async function putData(username, postid, title, body){
	let posts = client.db('BlogServer').collection('Posts');

	let data = await posts.find({username : username, postid : postid }).limit(1).toArray();
	if(data.length!=0){
		//Update post
		let currDate = new Date();
		let epoch = currDate.getTime();

		await posts.updateOne({username: username, postid: postid}, { $set : {title: title, body: body, modified: epoch}})
	} else {
		//Post does not exist
		await console.log("Post does not exist.");
		throw new Error('Post not found.');
	}
}

//make new post
async function postData(username, postid, title, body){
	let posts = client.db('BlogServer').collection('Posts');

	let data = await posts.find({username : username, postid : postid }).limit(1).toArray();
	if(data.length==0){
		//Create new post
		let currDate = new Date();
		let epoch = currDate.getTime();

		//Add to db
		await posts.insertOne({postid: postid, username: username, created: epoch, modified: epoch, title: title, body: body});
	} else {
		//Post already exists
		await console.log("Post already exists.");
		throw new Error('Post already exists.');
	}
}

// pass a number as postid. returns array of object
async function getData(username, postid=null){
	let posts = client.db('BlogServer').collection('Posts');

	let data;
	if(postid==null){
		data = await posts.find({ username : username }).toArray();
	} else {
		//throw error if postid does not exist.
		data = await posts.find({username : username, postid : postid }).limit(1).toArray();
		if(data.length==0){
			await console.log("Couldn't find post.");
			throw new Error('Post not found.');
		}
	}
	return data;
}

//check user details
function validateUser(username, token){
	//Check if token exists
	if(token==null){
		console.log("Missing token.");
		return false;
	}

	let secret = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
	let decoded = jwt.verify(token, secret);

	//Check if username match
	if(decoded.username!=username){
		console.log("Wrong username.");
		return false;
	}

	//Check token not expired
	let currDate = new Date();
	let epoch = currDate.getTime();

	if(decoded.exp<epoch){
		console.log("Expired token.");
		return false;
	}

	return true;
}

module.exports = router;
