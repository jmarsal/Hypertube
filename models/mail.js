const nodemailer = require('nodemailer');

class Mail {
	static sendActivation(user) {
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'pwortham.matcha@gmail.com',
				pass: 'matchamatcha'
			}
		});

		let mailOptions = {
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
				return console.log(error);
			}
		});
	}
}

module.exports = Mail;
