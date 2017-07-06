const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const usersSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    img: String,
    firstname: String,
    lastname: String
});

usersSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', usersSchema);
module.exports = User;