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

//update pereference
app.post('/prefer/*', function (req, res) {
	var postBody = req.body;
	console.log(postBody);
	var username = req.params[0];
	console.log(username);

	//database part
	var fs = require('fs');
	var sql = require('sql.js');

	var filebuffer = fs.readFileSync('User.db');
	var db = new sql.Database(filebuffer);
	db.run('UPDATE Users SET preference=' 
		+ '\'' + String(postBody.foodPreferList) +'\'' 
		+ 'WHERE username = ' + '\'' + String(username) +'\'');
	var data = db.export();
	var buffer = new Buffer(data);
	fs.writeFileSync('User.db', buffer);
	db.close();
	res.send('OK');
});

app.post('/users/', function (req, res) {
    var postBody = req.body;
    console.log(postBody);
	var username = postBody.username;
	var nickname = postBody.nickname;
	var password = postBody.password;
	var age = postBody.age;
	var gender = postBody.gender;
	var userid = username.hashCode();
	var email = postBody.email;

	//database part
	var fs = require('fs');
	var sql = require('sql.js');

	var filebuffer = fs.readFileSync('User.db');
	var db = new sql.Database(filebuffer);

	db.run('INSERT INTO Users VALUES (\'' + 
		String(userid)   + '\',\'' + String(username) + '\',\'' + 
  		String(password) + '\',\'' + String(nickname) + '\',\'' + 
  		String(age)      + '\',\'' + String(gender)   + '\',\'' +
  		String(email)    + '\',\'' + 
		'None' + '\')');

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

//profile page
app.get('/profile' , function (req,res) {
	res.sendFile(__dirname + '/static/profile.html');
});

//selector.html
app.get('/prefer' , function (req,res) {
	res.sendFile(__dirname + '/static/select.html');
});

//open up the sign up page
app.get('/signup', function (req, res) {
	res.sendFile(__dirname + '/static/signup.html');
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
app.get('/profile.css', function (req, res) {
	res.sendFile(__dirname + '/static/profile.css');
});
app.get('/cover.css', function (req, res) {
	res.sendFile(__dirname + '/static/cover.css');
});
app.get('/bootstrap.min.css', function (req, res) {
	res.sendFile(__dirname + '/static/bootstrap.min.css');
});
app.get('/bootstrap.min.js', function (req, res) {
	res.sendFile(__dirname + '/static/bootstrap.min.js');
});
app.get('/signin.css', function (req, res) {
	res.sendFile(__dirname + '/static/signin.css');
});
app.get('/signup.css', function (req, res) {
	res.sendFile(__dirname + '/static/signup.css');
});
app.get('/ie-emulation-modes-warning.js', function (req, res) {
	res.sendFile(__dirname + '/static/ie-emulation-modes-warning.js');
});
app.get('/select.css', function (req, res) {
	res.sendFile(__dirname + '/static/select.css');
});
app.get('/image-picker.css', function (req, res) {
	res.sendFile(__dirname + '/static/image-picker.css');
});
app.get('/image-picker.js', function (req, res) {
	res.sendFile(__dirname + '/static/image-picker.js');
});
app.get('/image-picker.min.js', function (req, res) {
	res.sendFile(__dirname + '/static/image-picker.min.js');
});
app.get('/masonry.pkgd.js', function (req, res) {
	res.sendFile(__dirname + '/static/masonry.pkgd.js');
});
app.get('/masonry.pkgd.min.js', function (req, res) {
	res.sendFile(__dirname + '/static/masonry.pkgd.min.js');
});
app.get('/imagesloaded.pkgd.js', function (req, res) {
	res.sendFile(__dirname + '/static/imagesloaded.pkgd.js');
});
app.get('/image/fried-rice.jpg', function (req, res) {
	res.sendFile(__dirname + '/static/image/fried-rice.jpg');
});
app.get('/image/ham.jpg', function (req, res) {
	res.sendFile(__dirname + '/static/image/ham.jpg');
});
app.get('/image/wings.jpg', function (req, res) {
	res.sendFile(__dirname + '/static/image/wings.jpg');
});
app.get('/image/noodle.jpg', function (req, res) {
	res.sendFile(__dirname + '/static/image/noodle.jpg');
});
app.get('/image/noodle-soup.jpg', function (req, res) {
	res.sendFile(__dirname + '/static/image/noodle-soup.jpg');
});
app.get('/image/steak.jpg', function (req, res) {
	res.sendFile(__dirname + '/static/image/steak.jpg');
});


// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
	var port = server.address().port;
	console.log('Server started at http://localhost:%s/', port);
});
