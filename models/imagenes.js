var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var img_shema = new Schema({
	title: {type:String , requerid:true},
	creator: {type: Schema.Types.ObjectId, ref:"User"},
	extension: {type: String, requerid: true}
});
var Imagen = mongoose.model("Imagen", img_shema);

module.exports = Imagen;