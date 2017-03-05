var express =require("express");
var Imagen = require("./models/imagenes");
var image_find_middleware = require("./middlewares/find_image");
var fs = require("fs");

var router =express.Router();

router.get("/", function(req, res){
	res.render("app/home");
});

router.get("/imagenes/new", function(req, res){
	res.render("app/imagenes/new");
});

router.all("/imagenes/:id*",image_find_middleware);

router.get("/imagenes/:id/edit", function(req, res){
		res.render("app/imagenes/edit");
});

router.route("/imagenes/:id")
 .get(function(req,res){
	res.render("app/imagenes/show");
	
	
})
.put(function(req,res){
	res.locals.imagen.title = req.body.title;
	res.locals.imagen.save(function(err){
			if (err) {
				res.redirect("app/imagenes/"+req.params.id+"edit");
			}
			else
			{
				res.render("app/imagenes/show");
			}
		})
})
.delete(function(req,res){
	Imagen.findOneAndRemove({_id:req.params.id}, function(err){
		if (!err) {
			res.redirect("/app/imagenes");
		}else
		{
			console.log(err)
			res.redirect("/app/imagenes"+req.params.id);
		}
	}) 
});

router.route("/imagenes")
.get(function(req,res){
	Imagen.find({},function(err, imagenes){
		if(err){res.redirect("/app"); return;};
		res.render("app/imagenes/index",{imagenes:imagenes});
	})
})
.post(function(req,res){
	var extension= req.body.archivo.name.split(".").pop();
	var data = {
		title: req.body.title,
		creator: res.locals.user._id,
		extension: extension
	};
	var imagen = new Imagen(data);
	imagen.save(function(err){
		if (!err) {
			fs.rename(req.body.archivo.path, "public/imagenes/"+imagen._id+"."+extension);
			res.redirect("/app/imagenes/"+imagen._id);

		}else
		{
			console.log(String(err))
		}
	})
});



module.exports = router;