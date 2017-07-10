const express = require('express');
const router = express.Router();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../models/user.js');

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

// FACEBOOK
passport.use(
	new FacebookStrategy(
		{
			clientID: '122480595025478',
			clientSecret: '28f0c656529abb43a369c615bef489e4',
			callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
			profileFields: [ 'id', 'emails', 'name', 'photos', 'displayName' ]
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOne(
				{
					'facebook.id': profile.id
				},
				function(err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						let randomKey =
							Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

						user = new User({
							username: profile._json.name,
							email: profile._json.email,
							firstname: profile._json.first_name,
							lastname: profile._json.last_name,
							img: profile.photos[0].value,
							activationKey: randomKey,
							active: true,
							facebook: profile._json
						});
						user.save(function(err) {
							if (err) console.log(err);
							return done(err, user);
						});
					} else {
						return done(err, user);
					}
				}
			);
		}
	)
);

// TWITTER
passport.use(
	new TwitterStrategy(
		{
			consumerKey: 'ol27noukksJ6cZi4bIWAUJVTw',
			consumerSecret: '68Xqfzlr1R8g3eFLn4aw8qVwOZXTO2ZsjMpYclVYIvixjDlPIr',
			callbackURL: 'http://localhost:3000/api/auth/twitter/callback',
			includeEmail: true
		},
		function(token, tokenSecret, profile, done) {
			User.findOne(
				{
					'twitter.id': profile.id
				},
				function(err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						let randomKey =
							Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

						user = new User({
							username: profile._json.screen_name,
							email: profile._json.email,
							firstname: profile._json.name,
							lastname: '',
							img: profile.photos[0].value,
							activationKey: randomKey,
							active: true,
							twitter: profile._json
						});
						user.save(function(err) {
							if (err) console.log(err);
							return done(err, user);
						});
					} else {
						return done(err, user);
					}
				}
			);
		}
	)
);

// GOOGLE
passport.use(
	new GoogleStrategy(
		{
			clientID: '145149806397-ldpgusv17htfi73hooms2louohnfo2j1.apps.googleusercontent.com',
			clientSecret: 'U0zfQdwS0S8rpNNCHdpLIJsd',
			callbackURL: 'http://localhost:3000/api/auth/google/callback'
		},
		function(token, tokenSecret, profile, done) {
			User.findOne(
				{
					'google.id': profile.id
				},
				function(err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						let randomKey =
							Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

						user = new User({
							username: profile._json.displayName,
							email: profile._json.emails[0].value,
							firstname: profile._json.name.givenName,
							lastname: profile._json.name.familyName,
							img: profile.photos[0].value,
							activationKey: randomKey,
							active: true,
							google: profile._json
						});
						user.save(function(err) {
							if (err) console.log(err);
							return done(err, user);
						});
					} else {
						return done(err, user);
					}
				}
			);
		}
	)
);

router.get('/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
	const payload = {
		_id: req.user._id,
		username: req.user.username
	};
	req.session.user = payload;

	req.session.save((err) => {
		if (err) throw err;
		res.redirect('/');
	});
});

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
	const payload = {
		_id: req.user._id,
		username: req.user.username
	};
	req.session.user = payload;

	req.session.save((err) => {
		if (err) throw err;
		res.redirect('/');
	});
});

router.get(
	'/google',
	passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/plus.login',
			'https://www.googleapis.com/auth/plus.profile.emails.read'
		]
	})
);

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
	const payload = {
		_id: req.user._id,
		username: req.user.username
	};
	req.session.user = payload;

	req.session.save((err) => {
		if (err) throw err;
		res.redirect('/');
	});
});

module.exports = router;
