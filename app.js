var express =require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;
var cookieSession = require("cookie-session");
var session_middlewares = require("./middlewares/session");
var router_app = require("./router_app");
var methodOverride = require("method-override");
var app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(cookieSession({
	name: "session",
	keys: ["llave-1","llave-2"]
}));

app.set("view engine", "jade");
app.get("/",function(req, res){
	console.log(req.session.user_id);
	res.render("index");
})
app.get("/signup",function(req, res){
	res.render("signup");
});
app.get("/login",function(req, res){
	res.render("login");
})
app.post("/users",function(req, res){
	var user = new User({email: req.body.email,
						 password: req.body.pass,
						 password_confirmation: req.body.pass_confirmation,
						 username: req.body.username});
	user.save().then(function(us){
		res.send("Guardamos al usuario correctamente")
	},function(err){
		console.log(String(err));
		res.send("No pudimos guardar al usuario debido a")
	})
});
app.post("/sessions",function(req, res){
	User.findOne({email:req.body.email, password: req.body.pass},function(err,user){	
		
		req.session.user_id = user._id;
		res.redirect("/app")

	});
});
app.use("/app",session_middlewares);
app.use("/app",router_app);

app.listen(8080);