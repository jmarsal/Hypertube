const express = require('express'),
	router = express.Router(),
	Videos = require('../models/video.js');

// GET LIST  OF MOVIES / TV SHOW FROM DB BY NAME
router.post('/getCollectionByTitleForClient', (req, res) => {
	// Voir comment gerer les movies yts et eztv avec les series eztv
	const title = { title: { $regex: req.body.title, $options: 'i' } };

	Videos.paginate(title, {
		page: req.body.page,
		limit: req.body.limit,
		sort: req.body.title === '' ? { seeds: 'desc' } : { title: 'asc' }
	})
		.then((json) => {
			if (json) {
				res.json({ status: 'success', payload: json });
			} else {
				res.json({ status: 'no_data' });
			}
		})
		.catch((err) => {
			if (err) {
				console.error(err);
				res.json({ status: 'error', content: err });
			}
		});
});

// GET LIST  OF MOVIES / TV SHOW FROM DB BY NAME
router.get('/getmoviedetails/:movieID', (req, res) => {
	Videos.findOne({ _id: req.params.movieID }, (err, movie) => {
		if (movie) {
			res.json({ status: 'success', data: movie });
		} else {
			res.json({ status: 'error', data: [ { msg: 'An error occured.' } ] });
		}
	});
});

module.exports = router;
