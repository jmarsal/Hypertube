const nodemailer = require('nodemailer');
const fs = require('fs');

class Mail {
	static sendActivation(user) {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'pwortham.matcha@gmail.com',
				pass: 'matchamatcha'
			}
		});

		const email = user.email,
			login = user.username,
			cle = user.activationKey;
		let contentMail = '',
			search = {
				titre: '^^title^^',
				login: '^^login^^',
				link: '^^link^^'
			},
			replace = {
				titre: 'Welcome to Hypertube !',
				login: login,
				link: 'localhost:3000/activation?user=' + encodeURIComponent(login) + '&key=' + encodeURIComponent(cle)
			};
		fs.readFile('src/mailTemplates/subscribe.html', (err, data) => {
			if (err) {
				return console.error(err);
			}
			contentMail = data.toString();
			const mailOptions = {
				from: '"Hypertube Support" <noreply@hypertube.com>', // sender address
				to: email, // list of receivers
				subject: 'Activation Hypertube for ' + login, // Subject line
				html: contentMail
					.replace(search.login, replace.login)
					.replace(search.titre, replace.titre)
					.replace(search.link, replace.link) // html body
			};
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.error(error);
				}
			});
		});
	}

	static sendMailForget(user) {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'pwortham.matcha@gmail.com',
				pass: 'matchamatcha'
			}
		});

		const email = user.email,
			login = user.login,
			cle = user.key;

		let contentMail = '',
			search = {
				titre: '^^title^^',
				login: '^^login^^',
				link: '^^link^^'
			},
			replace = {
				titre: "Don't Panic !",
				login: login,
				link:
					'localhost:3000/reinitialisation?user=' +
					encodeURIComponent(login) +
					'&key=' +
					encodeURIComponent(cle)
			};
		fs.readFile('src/mailTemplates/reinitMail.html', (err, data) => {
			if (err) {
				return console.error(err);
			}
			contentMail = data.toString();
			const mailOptions = {
				from: '"Hypertube Support" <noreply@hypertube.com>', // sender address
				to: email, // list of receivers
				subject: "Don't Panic ! " + login, // Subject line
				html: contentMail
					.replace(search.login, replace.login)
					.replace(search.titre, replace.titre)
					.replace(search.link, replace.link) // html body
			};
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.error(error);
				}
			});
		});
	}
}

module.exports = Mail;
