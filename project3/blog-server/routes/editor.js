var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken')

//all paths to editor must pass through this
router.all('/*', function(req, res, next) {
	//verify cookie if exists
	if(validateUser(req.cookies.jwt)){
		next();
		return;
	} else {
		res.redirect('/login?redirect=/editor/');
  		return;
	}
});

//check user details and checks that token is not expired
function validateUser(token){
	//Check if token exists
	if(token==null){
		console.log("Missing token.");
		return false;
	}

	let secret = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
	let decoded = jwt.verify(token, secret);

	//Check token not expired
	let currDate = new Date();
	let epoch = currDate.getTime();

	if(decoded.exp<epoch){
		console.log("Expired token.");
		return false;
	}

	console.log("JWT Verified.");
	return true;
}

module.exports = router;
