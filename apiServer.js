const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let app = express();

// MIDDLEWARE

app.use(bodyParser.json());
app.use(validator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// APIs
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/hypertube');

let db = mongoose.connection;
db.on('error', console.error.bind(console, '# MongoDB - connection error: '));

//---->>> SET UP SESSIONS <<<-----
app.use(
	session({
		secret: 'ferEFdf_dsvVaas',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 60 * 24 * 2 },
		store: new MongoStore({ mongooseConnection: db, ttl: 2 * 24 * 60 * 60 }),
		unset: 'destroy'
		//ttl: 2 days * 24 hours * 60 minutes * 60 seconds
	})
);
app.use(passport.initialize());
app.use(passport.session());

let User = require('./models/user');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROUTES API
app.use('/users', require('./API/users'));
app.use('/auth', require('./API/auth'));
app.use('/collection', require('./API/collection'));
app.use('/torrent', require('./API/torrent'));

// GET LIST MOVIES IN DB
const createLibrary = require('./models/createLibrary');
createLibrary();

// END APIs

app.listen(3001, (err) => {
	if (err) {
		return console.error(err);
	}
	console.log('API Server is listening in http://localhost:3001');
});
