const express = require('express');
const router = express.Router();
const request = require('request');
const mkdirp = require('mkdirp');

// GET LIST OF MOVIES BY NAME
router.post('/searchMovies', (req, res) => {
	const movie = req.body.nameMovie;
	// const requete = 'https://yts.ag/api/v2/list_movies.json?query_term=' + movie;
	var url = 'https://yts.ag/api/v2/list_movies.json?query_term=' + movie;

	request({ url: url }, (status, status_message, data) => {
		if (status_message.status === 'ok') {
			res.json({ status: 'success', data: res });
		} else {
			res.json({ status: 'error', status_message: status_message });
		}
	});
});
module.exports = router;
