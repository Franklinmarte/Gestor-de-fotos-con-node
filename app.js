var express =require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;
var app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.set("view engine", "jade");

app.get("/",function(req, res){
	res.render("index");

})
app.get("/login",function(req, res){
	res.render("login");

})
app.post("/users",function(req, res){
	var user = new User({email: req.body.email,
						 password: req.body.pass,
						 password_confirmation: req.body.pass_confirmation});

	user.save(function(err){
		if (err) {
			console.log(String(err))
		}
		
			res.send("recibimos");
		
	});

	

})


app.listen(8080);