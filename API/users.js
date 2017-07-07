const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const passport = require('passport');

const User = require('../models/user.js');
const Check = require('../models/check.js');

//---->>> POST USER <<<-----
router.post('/', (req, res) => {
	Check.userExists(req.body.username)
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
					User.register(
						new User({
							username: req.body.username,
							email: req.body.email,
							firstname: req.body.firstname,
							lastname: req.body.lastname
						}),
						req.body.password,
						function(err, user) {
							if (err) throw err;

							passport.authenticate('local')(req, res, function() {
								res.json({ status: 'success', content: user });
							});
						}
					);
				} else {
					res.json({ status: 'error', content: response.data });
				}
			}
		})
		.catch((err) => {
			console.error(err);
		});
});

//---->>> LOGIN <<<-----
router.post('/login', (req, res, next) => {
	// debugger;
	const user = req.body;
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return res.status(400).send({ message: 'Bad request' });
		}

		if (!user) {
			return res.status(401).send(info);
		}

		req.logIn(user, (err) => {
			if (err) {
				return res.status(400).send({ message: 'Bad request' });
			}
			const payload = {
				id: user.id,
				username: user.username
			};
			// debugger;
			res.json({ status: 'success', user: payload });

			// debugger;

			// const token = jwt.sign(payload, app.get(`secretOrKey`)),
			// 	resObj = {
			// 		user: `${user.username}`,
			// 		id: user.id,
			// 		token: token,
			// 		settings: null
			// 	};

			// const settingsQuery = SettingsModel.findOne({
			// 	user: req.user
			// }).select(`-active -createdAt -updatedAt -__v -user`);

			// settingsQuery
			// 	.exec()
			// 	.then((settings) => {
			// 		if (settings) {
			// 			resObj.settings = settings;
			// 		}

			// 		res
			// 			.status(200)
			// 			.cookie(`jwt`, token, {
			// 				secure: false,
			// 				httpOnly: false,
			// 				domain: `.electroleak${config.tld}`,
			// 				maxAge: 30 * 24 * 60 * 60 * 1000 // 1 month
			// 			})
			// 			.send(resObj);
			// 	})
			// 	.catch((err) => {
			// 		console.log(err);
			// 		return res.status(400).send({ message: `Bad request` });
			// 	});
		});
	})(req, res, next);
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
	let user = req.body;
	user[0].password = crypto.createHash('sha512').update(user[0].password).digest('hex');
	let query = {};
	query._id = req.params._id;

	let update = {
		$set: {
			username: user.username,
			password: user.password,
			email: user.email,
			img: user.img,
			firstname: user.firstname,
			lastname: user.lastname
		}
	};

	let options = { new: true };

	User.findOneAndUpdate(query, update, options, (err, user) => {
		if (err) throw err;
		res.json(user);
	});
});

module.exports = router;
