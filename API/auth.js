const express = require('express');
const router = express.Router();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models/user.js');

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(
	new FacebookStrategy(
		{
			clientID: '122480595025478',
			clientSecret: '28f0c656529abb43a369c615bef489e4',
			callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
			profileFields: [ 'id', 'emails', 'name', 'photos', 'displayName' ]
		},
		function(accessToken, refreshToken, profile, done) {
			console.log(profile);
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

module.exports = router;
