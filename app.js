var express =require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;
var session = require("express-session");
var session_middlewares = require("./middlewares/session");
var router_app = require("./router_app");
var formidable = require("express-formidable");
var RedisStore = require("connect-redis")(session);
var http = require("http");
var realtime = require("./realtime");

var methodOverride = require("method-override");

var app = express();
var server = http.Server(app);


app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

var sessionMiddewares = session({
	store: new RedisStore({}),
	secret: "8292302164"
});

app.use(sessionMiddewares);

realtime(server,sessionMiddewares);

app.use(formidable.parse({keepExtensions:true}));
app.set("view engine", "jade");
app.get("/",function(req, res){

	res.render("index");
})
app.get("/signup",function(req, res){
	res.render("signup");
});
app.get("/login",function(req, res){
	
	if (req.session.user_id) {
		res.redirect("/app");
		
	}else
	{

console.log(req.session.user_id);
		res.render("login");
	}
	
	

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
		
		if (!err && user !=null) {

		req.session.user_id = user._id;
		res.redirect("/app")
		}
		else
		{
			console.log(String(err));
			res.redirect("/login");
		}

	});
});
app.use("/app",session_middlewares);
app.use("/app",router_app);

server.listen(8080);