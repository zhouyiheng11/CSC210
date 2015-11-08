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
    console.log(postBody);
	var username = postBody.username;
	var nickname = postBody.nickname;
	var password = postBody.password;
	var age = postBody.age;
	var gender = postBody.gender;
	var userid = username.hashCode();

	//database part
	var fs = require('fs');
	var sql = require('sql.js');

	var filebuffer = fs.readFileSync('User.db');
	var db = new sql.Database(filebuffer);

	db.run('INSERT INTO Users VALUES (\'' + 
		String(userid)   + '\',\'' + String(username) + '\',\'' + 
  		String(password) + '\',\'' + String(nickname) + '\',\'' + 
  		String(age)      + '\',\'' + String(gender)   + '\')');

	var stmt = db.prepare("SELECT * FROM Users WHERE username=:user");
	var result = stmt.getAsObject({':user' : username});
	console.log(result);

	var data = db.export();
	var buffer = new Buffer(data);
	fs.writeFileSync('User.db', buffer);

	db.close();
	res.send('OK');
});

app.get('/login/*',function (req,res){
	var username = req.params[0];
	//database part
	var fs = require('fs');
	var sql = require('sql.js');

	var filebuffer = fs.readFileSync('User.db');
	var db = new sql.Database(filebuffer);

	var stmt = db.prepare("SELECT * FROM Users WHERE username=:user");
	var result = stmt.getAsObject({':user' : username});

	console.log(result); //Will print the user colomn

	db.close();
	res.send(result);
	return;
});

//open up the sign up page
app.get('/signup', function (req, res) {
	res.sendFile(__dirname + '/static/index.html');
});

//open up the sign in page
app.get('/signin', function (req, res) {
	res.sendFile(__dirname + '/static/signin.html');
});


//send welcome pages
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/static/welcome.html');
});

//send resource
app.get('/cover.css', function (req, res) {
	res.sendFile(__dirname + '/static/cover.css');
});
app.get('/bootstrap.min.css', function (req, res) {
	res.sendFile(__dirname + '/static/bootstrap.min.css');
});
app.get('/signin.css', function (req, res) {
	res.sendFile(__dirname + '/static/signin.css');
});
app.get('/ie-emulation-modes-warning.js', function (req, res) {
	res.sendFile(__dirname + '/static/ie-emulation-modes-warning.js');
});

// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
	var port = server.address().port;
	console.log('Server started at http://localhost:%s/', port);
});
