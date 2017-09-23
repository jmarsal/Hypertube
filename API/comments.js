const express = require('express');
const router = express.Router();

const Library = require('../models/video.js');
const Check = require('../models/check.js');

function findMovie(_id) {
	return new Promise((resolve, reject) => {
		Library.findOne({ _id: _id }, function(err, movie) {
			if (movie) {
				resolve(movie);
			} else {
				reject('There is no movies with this ID');
			}
		});
	});
}

router.get('/:_id', (req, res) => {
	if (req.user) {
		Check.tokenExists(req.user.token)
			.then((response) => {
				if (response.status === 'error') {
					return res.status(401).send('HTTP401 Unauthorized : Bad API_TOKEN');
				} else {
					findMovie(req.params._id)
						.then((movie) => {
							if (movie.comments) {
								res.json({ status: 'success', content: movie.comments });
							} else {
								res.json({ status: 'success', content: 'There is no comments yet.' });
							}
						})
						.catch((err) => {
							console.error(err);
						});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		return res.status(401).send('HTTP401 Unauthorized : Not logged.');
	}
});

router.post('/', (req, res) => {
	if (req.user) {
		Check.tokenExists(req.user.token)
			.then((response) => {
				if (response.status === 'error') {
					return res.status(401).send('HTTP401 Unauthorized : Bad API_TOKEN');
				} else {
					findMovie(req.body.movieId)
						.then((movie) => {
							let newComment = new Object();
							newComment.username = req.body.username;
							newComment.date = new Date();
							newComment.comment = req.body.comment;

							if (movie.comments) {
								movie.comments.push(newComment);
							} else {
								movie.comments[0] = newComment;
							}

							movie.save();
							res.json({ status: 'success', content: movie.comments });
						})
						.catch((err) => {
							console.error(err);
						});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		return res.status(401).send('HTTP401 Unauthorized : Not logged.');
	}
});

module.exports = router;
