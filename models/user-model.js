const mongoose = require('mongoose');
const bcrypt =  require('bcrypt');

const UserSchema = mongoose.Schema({
	
	firstLogin: {type: Boolean, default: true},
    country: {type : String, default : '', required: true},
	
	first_name : {type : String, default : '', required: true},
    last_name : {type : String, default : '', required: true},
    
	email : {type : String, unique : true, required: true},
    password : {type : String, default : '', required: true},
	
	address: {type : String, default : '', required: true},
	city: {type : String, default : '', required: true},
	state: {type : String, default : '', required: true},
	
	zip_code: {type: String, default: ''},
	contact_number: { type: String, default: '' }    
});

UserSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);