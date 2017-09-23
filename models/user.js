const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const usersSchema = mongoose.Schema({
	username: String,
	email: String,
	img: String,
	firstname: String,
	lastname: String,
	activationKey: String,
	active: Boolean,
	language: { type: String, default: 'en' },
	admin: { type: Boolean, default: false },
	token: String,
	oauthID: String,
	facebook: JSON,
	twitter: JSON,
	google: JSON,
	github: JSON,
	42: JSON
});

usersSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', usersSchema);
module.exports = User;
