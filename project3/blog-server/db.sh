use BlogServer
db.dropDatabase()
use BlogServer

db.createCollection("Posts")
db.createCollection("Users")

var postsFile = cat('./posts.json');
var usersFile = cat('./users.json');

var posts = JSON.parse(postsFile);
var users = JSON.parse(usersFile);

db.Posts.insert(posts)
db.Users.insert(users)