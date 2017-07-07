const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const usersSchema = mongoose.Schema({
	username: String,
	email: String,
	img: String,
	firstname: String,
	lastname: String,
	activationKey: String,
	active: Boolean
});

usersSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', usersSchema);
module.exports = User;
