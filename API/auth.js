const express = require('express');
const router = express.Router();
const passport = require('passport');
const request = require('request');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const OAuth2Strategy = require('passport-oauth2').Strategy;
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

// GITHUB
passport.use(
	new GitHubStrategy(
		{
			clientID: 'e57a80157a15dbda44df',
			clientSecret: 'bc56f1b247d4f25c8c8615606a27970357eb2115',
			callbackURL: 'http://localhost:3000/api/auth/github/callback',
			scope: [ 'user:email' ]
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOne(
				{
					'github.id': profile.id
				},
				function(err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						let randomKey =
							Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

						user = new User({
							username: profile._json.login,
							email: profile.emails[0].value,
							firstname: '',
							lastname: '',
							img: profile.avatar_url,
							activationKey: randomKey,
							active: true,
							github: profile._json
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

//42
passport.use(
	new OAuth2Strategy(
		{
			authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
			tokenURL: 'https://api.intra.42.fr/oauth/token',
			clientID: '321b6f72529ad904d3eebf53a1753f0ea6d6b676b7fa28fa503442c0ecf1977f',
			clientSecret: 'f712697df47b81cd7cd62dcb71141c8d6c28bbdd8f23fe3be0dfce4ce15ef743',
			callbackURL: 'http://localhost:3000/api/auth/42/callback'
		},
		function(accessToken, refreshToken, profile, done) {
			var options = {
				url: 'https://api.intra.42.fr/v2/me',
				headers: {
					Authorization: 'Bearer ' + accessToken
				}
			};

			request(options, function(error, response, profile) {
				if (!error && response.statusCode == 200) {
					profile = JSON.parse(profile);

					console.log(profile);
					User.findOne(
						{
							'42.id': profile.id
						},
						function(err, user) {
							if (err) {
								return done(err);
							}
							if (!user) {
								let randomKey =
									Math.random().toString(36).substring(2, 15) +
									Math.random().toString(36).substring(2, 15);

								user = new User({
									username: profile.login,
									email: profile.email,
									firstname: profile.first_name,
									lastname: profile.last_name,
									img: profile.image_url,
									activationKey: randomKey,
									active: true,
									42: profile
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
			});
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

router.get('/github', passport.authenticate('github', { scope: [ 'user' ] }));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
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

router.get('/42', passport.authenticate('oauth2'));

router.get('/42/callback', passport.authenticate('oauth2', { failureRedirect: '/login' }), function(req, res) {
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
