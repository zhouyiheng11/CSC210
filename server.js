//initialize the express object
var app = require('express')(); 

//hashcode design for userid
String.prototype.hashCode = function(){
	var hash = 0, len = this.length;
	if ( len === 0 ) return hash;
	for( var i = 0; i < len; ++i ) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}
//use body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/users/', function (req, res) {
    var postBody = req.body;
    console.log(postBody)
	var username = postBody.username;
	var nickname = postBody.nickname;
	var password = postBody.password;
	var age = postBody.age;
	var gender = postBody.gender;
	var userid = username.hashCode();
	var flag = 1;
	//database part
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database('User.db');
	db.serialize(function(flag) {
  		//inserting information into the database
		db.run('insert into Users values(\'' + String(userid) + '\',\'' + String(username) + '\',\'' + 
  		String(password) + '\',\'' + String(nickname) + '\',\'' + String(age) + '\',\'' + String(gender) + '\')');
	});

	db.close();
	res.send('OK');
});


//open up the sign in page
app.get('/signup', function (req, res) {
	res.sendFile(__dirname + '/static/index.html');
});


// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
	var port = server.address().port;
	console.log('Server started at http://localhost:%s/', port);
});
