const User = require('./user');

class Check {
	static subscribeInputs(req) {
		return new Promise((resolve, reject) => {
			req.checkBody('username', 'Login: 3 to 14 characters required.').len(3, 14);
			req.checkBody('email', 'Invalid email.').isEmail().notEmpty();
			req.checkBody('firstname', 'Firstname: 1 to 30 characters required.').len(1, 30);
			req.checkBody('lastname', 'Lastname: 1 to 30 characters required.').len(1, 30);
			req
				.checkBody('password', 'Password: minimum 6 characters, 1 uppercase and 1 digit required.')
				.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i');

			let errors = req.validationErrors();
			if (errors) {
				resolve({ status: 'error', data: errors });
			} else {
				resolve({ status: 'success' });
			}
		});
	}

	static subscribeInputsForUpdate(req) {
		return new Promise((resolve, reject) => {
			req.checkBody('username', 'Login: 3 to 14 characters required.').len(3, 14);
			req.checkBody('email', 'Invalid email.').isEmail().notEmpty();
			req.checkBody('firstname', 'Firstname: 1 to 30 characters required.').len(1, 30);
			req.checkBody('lastname', 'Lastname: 1 to 30 characters required.').len(1, 30);
			if (req.body.password) {
				req
					.checkBody('password', 'Password: minimum 6 characters, 1 uppercase and 1 digit required.')
					.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i');
			}

			let errors = req.validationErrors();
			if (errors) {
				resolve({ status: 'error', data: errors });
			} else {
				resolve({ status: 'success' });
			}
		});
	}

	static connectionInputs(req) {
		return new Promise((resolve, reject) => {
			req.checkBody('login', 'Invalid Login / Password.').notEmpty();
			req
				.checkBody('password', 'Password: minimum 6 characters, 1 uppercase and 1 digit required.')
				.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i');

			let errors = req.validationErrors();
			if (errors) {
				resolve({ status: 'error', data: errors });
			} else {
				resolve({ status: 'success' });
			}
		});
	}

	static userExists(username) {
		return new Promise((resolve, reject) => {
			User.findOne({ username: username }, function(err, user) {
				if (user) {
					resolve({ status: 'error', data: [ { msg: 'This username already exists.' } ] });
				} else {
					resolve({ status: 'success' });
				}
			});
		});
	}

	static userExistsForUpdate(username, userToUpdate) {
		return new Promise((resolve, reject) => {
			User.findOne({ username: username }, function(err, user) {
				if (user && userToUpdate.username !== user.username) {
					resolve({ status: 'error', data: [ { msg: 'This username already exists.' } ] });
				} else {
					resolve({ status: 'success' });
				}
			});
		});
	}

	static mailExists(email) {
		return new Promise((resolve, reject) => {
			User.findOne({ email: email }, function(err, user) {
				if (user) {
					resolve({ status: 'error', data: [ { msg: 'This email is already used.' } ] });
				} else {
					resolve({ status: 'success' });
				}
			});
		});
	}

	static mailExistsForUpdate(email, userToUpdate) {
		return new Promise((resolve, reject) => {
			User.findOne({ email: email }, function(err, user) {
				if (user && userToUpdate.email !== user.email) {
					resolve({ status: 'error', data: [ { msg: 'This email is already used.' } ] });
				} else {
					resolve({ status: 'success' });
				}
			});
		});
	}

	static isActive(username) {
		return new Promise((resolve, reject) => {
			User.findOne({ username: username }, function(err, user) {
				if (user.active === false) {
					resolve({ status: 'error', data: [ { msg: 'This username already exists.' } ] });
				} else {
					resolve({ status: 'success' });
				}
			});
		});
	}

	static tokenExists(token) {
		return new Promise((resolve, reject) => {
			User.findOne({ token: token }, function(err, user) {
				if (user) {
					resolve({ status: 'error', data: [ { msg: 'Invalid token.' } ] });
				} else {
					resolve({ status: 'success' });
				}
			});
		});
	}
}

module.exports = Check;
