const express = require('express');
const router = express.Router();
const multer = require('multer');
const mkdirp = require('mkdirp');
const passport = require('passport');
const fs = require('fs');

const User = require('../models/user.js');
const Check = require('../models/check.js');
const Mail = require('../models/mail.js');

//---->>> POST USER <<<-----
router.post('/', (req, res) => {
	Check.userExists(req.body.username)
		.then((response) => {
			if (response.status === 'success') {
				return Check.mailExists(req.body.email);
			} else {
				res.json({ status: 'error', content: response.data });
			}
		})
		.then((response) => {
			if (response.status === 'success') {
				return Check.subscribeInputs(req);
			} else {
				res.json({ status: 'error', content: response.data });
			}
		})
		.then((response) => {
			if (response) {
				if (response.status === 'success') {
					let randomKey =
						Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

					User.register(
						new User({
							username: req.body.username,
							email: req.body.email,
							firstname: req.body.firstname,
							lastname: req.body.lastname,
							img: req.body.img,
							activationKey: randomKey,
							active: false
						}),
						req.body.password,
						function(err, user) {
							if (err) throw err;

							passport.authenticate('local')(req, res, function() {
								Mail.sendActivation(user);
								res.json({ status: 'success', content: user });
							});
						}
					);
				} else {
					fs.unlink('./public/upload/' + req.body.img, () => {
						res.json({ status: 'error', content: response.data });
					});
				}
			}
		})
		.catch((err) => {
			console.error(err);
		});
});

//---->>> LOGIN <<<-----
router.post('/login', (req, res, next) => {
	const user = req.body;
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return res.json({ status: 'error', msg: 'Error while logging in.' });
		}

		if (!user) {
			return res.json({ status: 'error', msg: 'Invalid username/password.' });
		}

		req.logIn(user, (err) => {
			if (err) {
				console.error(err);
				return res.json({ status: 'error', msg: 'Error while logging in.' });
			}

			Check.isActive(user.username)
				.then((response) => {
					if (response.status === 'success') {
						const payload = {
							_id: user._id,
							username: user.username
						};
						req.session.user = payload;

						req.session.save((err) => {
							if (err) throw err;
							return res.json({ status: 'success', user: payload });
						});
					} else {
						return res.json({ status: 'error', msg: 'This account is not activated.' });
					}
				})
				.catch((err) => {
					console.error(err);
				});
		});
	})(req, res, next);
});

// USER DISCONNECT
router.get('/disconnect', (req, res) => {
	req.logout();
	req.session = null;
	res.redirect('/');
});

// GET SESSION
router.get('/session', (req, res) => {
	if (typeof req.session.user !== 'undefined') {
		res.json(req.session.user);
	}
});

// FORGET PASSWORD OR USERNAME
router.post('/forget', (req, res) => {
	User.findOne({ email: req.body.email }, function(err, user) {
		if (!user) {
			res.json({ status: 'error' });
		} else {
			let randomKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

			const infoUser = {
				email: user.email,
				login: user.username,
				key: randomKey
			};

			let query = {};
			query._id = user._id;

			let update = {
				$set: {
					activationKey: randomKey,
					active: true
				}
			};

			let options = { new: true };

			User.findOneAndUpdate(query, update, options, (err, user) => {
				if (err) throw err;
				Mail.sendMailForget(infoUser);
				res.json({ status: 'success' });
			});
		}
	});
});

//---->>> GET ONE USER <<<-----
router.get('/one/:user', (req, res) => {
	console.log(req.params.user);
	User.findOne({ username: req.params.user }, function(err, user) {
		if (user) {
			console.log(user);
			res.json({ status: 'success', data: user });
		} else {
			res.json({ status: 'error', data: [ { msg: 'An error occured.' } ] });
		}
	});
});

//---->>> GET USERS <<<-----
router.get('/', (req, res) => {
	User.find((err, users) => {
		if (err) throw err;
		res.json(users);
	});
});

//---->>> DELETE USER <<<-----
router.delete('/:_id', (req, res) => {
	let query = { _id: req.params._id };

	User.remove(query, (err, user) => {
		if (err) throw err;
		res.json(user);
	});
});

//---->>> UPDATE USER <<<-----
router.put('/:_id', (req, res) => {
	const user = req.body;
	let query = {};
	query._id = req.params._id;
	let randomKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

	User.findOne({ username: user.username }, (err, userToUpdate) => {
		if (!userToUpdate) {
			res.json({ status: 'error' });
		}

		Check.userExistsForUpdate(req.body.username, userToUpdate)
			.then((response) => {
				if (response.status === 'success') {
					return Check.mailExistsForUpdate(req.body.email, userToUpdate);
				} else {
					res.json({ status: 'error', content: response.data });
				}
			})
			.then((response) => {
				if (response.status === 'success') {
					return Check.subscribeInputsForUpdate(req);
				} else {
					res.json({ status: 'error', content: response.data });
				}
			})
			.then((response) => {
				if (response) {
					if (response.status === 'success') {
						let update = {
							$set: {
								username: user.username,
								email: user.email,
								img: user.img,
								firstname: user.firstname,
								lastname: user.lastname,
								activationKey: randomKey,
								active: true
							}
						};

						let options = { new: true };

						User.findOneAndUpdate(query, update, options, (err, userUpdated) => {
							if (err) throw err;
							const payload = {
								_id: userUpdated._id,
								username: userUpdated.username
							};
							req.session.user = payload;

							req.session.save((err) => {
								if (err) throw err;

								userToUpdate.setPassword(user.password, () => {
									userToUpdate.save();
									return res.json({ status: 'success', user: payload });
								});
							});
						});
					} else {
						res.json({ status: 'error', content: response.data });
					}
				}
			})
			.catch((err) => {
				console.error(err);
			});
	});
});

//---->>> UPLOAD USER'S IMAGE <<<-----
router.post('/upload', (req, res) => {
	mkdirp('./public/upload', function(err) {
		if (!err) {
			let Storage = multer.diskStorage({
				destination: function(req, file, callback) {
					callback(null, './public/upload');
				},
				filename: function(req, file, callback) {
					callback(null, req.body.name);
				}
			});

			let upload = multer({
				storage: Storage,
				fileFilter: (req, file, cb) => {
					if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
						res.json({ status: 'error', content: [ { msg: 'Avatar: Wrong format.' } ] });
					} else {
						cb(null, true);
					}
				}
			}).single('file');

			upload(req, res, function(err) {
				if (err || !req.file) {
					console.error(err);
					res.json({ status: 'error', content: [ { msg: 'Avatar: Please, choose a file.' } ] });
				} else {
					res.json({ status: 'success', content: '' });
				}
			});
		} else throw err;
	});
});

// ACCOUNT ACTIVATION
router.get('/activation', (req, res) => {
	User.findOne({ activationKey: req.query.key }, function(err, user) {
		if (!user || user.username !== req.query.user) {
			res.json({ status: 'error' });
		} else {
			let user = req.body;
			let randomKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

			let query = {};
			query.username = req.query.user;

			let update = {
				$set: {
					activationKey: randomKey,
					active: true
				}
			};

			let options = { new: true };

			User.findOneAndUpdate(query, update, options, (err, user) => {
				if (err) throw err;
				res.json({ status: 'success' });
			});
		}
	});
});

//UPDATE PASSWORD FOR REINIT
router.post('/reinitialisation', (req, res) => {
	const user = req.body;
	debugger;
	User.findOne({ username: user.username }, (err, userToUpdate) => {
		if (!userToUpdate) {
			res.json({ status: 'error' });
		}

		userToUpdate.setPassword(user.password, () => {
			userToUpdate.save();
			res.status(200).json({ status: 'success' });
		});
	});
});

module.exports = router;
