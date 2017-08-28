const express = require('express');
const router = express.Router();

const Library = require('../models/library.js');

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
});

router.post('/', (req, res) => {
	console.log(req.body);
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
});

module.exports = router;
