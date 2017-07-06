const User = require('./user');

class Check {
	static subscribeInputs(req) {
		return new Promise((resolve, reject) => {
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
}

module.exports = Check;
