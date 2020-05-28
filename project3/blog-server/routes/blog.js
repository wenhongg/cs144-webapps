var express = require('express');
var createError = require('http-errors');
var router = express.Router();
var commonmark = require('commonmark');

let client = require('../db');
let reader = new commonmark.Parser();
let writer = new commonmark.HtmlRenderer();

//Get single blog post
router.get('/:username/:postid', function(req, res, next) {
	let username = req.params.username;
	let postid = parseInt(req.params.postid);

	if(isNaN(postid)){
		console.log("not a number.");
		//Bad request
		next(createError(404));
		return;
	}
	//Get data and render data.
	getData(username, postid)
	.then(data => {
		if(data[0].postid!=postid){
			throw new Error("Post not found.");
		}
		res.render('post', { user: username, posts: [data[0]]});
	})
	.catch(() => next(createError(404)))
});

router.get('/:username', function(req, res, next) {
	let username = req.params.username;
	let postid = req.query.start;

	if(postid==undefined){
		postid==null;
	} else {
		postid = parseInt(postid);
		if(isNaN(postid)){
			console.log("not a number.");
			//Bad request
			next(createError(404));
			return;
		}
	}
	//Get data and render data.
	getData(username, postid)
	.then(data => res.render('post', { user: username, posts: data}))
	.catch(() => next(createError(404)))
});

// pass a number as postid.
async function getData(username, postid=null){
	let posts = client.db('BlogServer').collection('Posts');
	let users = client.db('BlogServer').collection('Users');

	//Throw error if user does not exist.
	let user = await users.find({username : username}).toArray();
	if(user.length==0){
		console.log("Couldn't find user.");
		throw new Error('User not found.');
	}
	let data;
	if(postid==null){
		data = await posts.find({ username : username }).toArray();
	} else {
		data = await posts.find({ username : username , postid: { $gte: postid } }).toArray();
	}

	//use commonmark and parse body, get string from epoch time
	for(let i=0;i<data.length;i++){
		data[i].body = writer.render(reader.parse(data[i].body));
		data[i].title = writer.render(reader.parse(data[i].title));

		let modified = new Date(data[i].modified);
		data[i].modified = modified.toString();

		let created = new Date(data[i].created).toString();
		data[i].created = created.toString();
	}

	return data;
}

module.exports = router;
