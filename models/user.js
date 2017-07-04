let mongoose = require('mongoose');

let usersSchema = mongoose.Schema({
    login: String,
    email: String,
    password: String,
    img: String,
    firstname: String,
    lastname: String
});

let Users = mongoose.model('Users', usersSchema);
module.exports = Users;