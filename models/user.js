var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost/proyectonode");

var posibles_valores= ["F","M"]

var user_schema = new Schema({
	name: String,
	username: {type: String, required:"El username esta vacio",maxlength:[50,"UserName muy largo"]},
	password: {type: String, minlength:[3,"el pass es muy corto"]},
	age:{type:Number, min:[5,"la edad no puede ser menor que 5"], max:[100,"la edad no puede ser mayor que 100"]},
	email:{type: String, required: "El correo es obligatorio"},
	date_of_birth: Date,
	sex: {type: String, enum:{values: posibles_valores, message:"Opcion no valida"}}
});
user_schema.virtual("pass_confirmation").get(function(){
	return this.p_c;

}).set(function(password){
	this.p_c = password;
})

var User = mongoose.model("User", user_schema);

module.exports.User = User;
