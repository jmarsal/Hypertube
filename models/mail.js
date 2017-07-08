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

		const mailOptions = {
			from: '"Hypertube Support" <noreply@hypertube.com>',
			to: user.email,
			subject: 'Activation Hypertube',
			html:
				'<b>Bienvenue sur Hypertube !</b>' +
					'<br />' +
					'<p>Veuillez cliquer <a href="http://localhost:3000/activation?user=' +
					user.username +
					'&key=' +
					user.activationKey +
					'">ici</a> pour activer votre compte !</p>' +
					"<p>Si la page ne s'affiche pas copiez-collez ce lien dans votre navigateur : </p>" +
					'<a href="http://localhost:3000/activation?user=' +
					user.username +
					'&key=' +
					user.activationKey +
					'">http://localhost:3000/activation?user=' +
					user.username +
					'&key=' +
					user.activationKey +
					'</a>' +
					'<br />' +
					'<p>A très vite sur Hypertube !</p>'
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.error(error);
			}
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
					'localhost:3000/forget-passwd?log=' + encodeURIComponent(login) + '&cle=' + encodeURIComponent(cle)
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
