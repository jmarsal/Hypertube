const express = require('express'),
	router = express.Router(),
	Videos = require('../models/video.js');

const Check = require('../models/check.js');

// GET LIST  OF MOVIES / TV SHOW FROM DB BY NAME
router.post('/getCollectionByTitleForClient', (req, res) => {
	if (req.user) {
		Check.tokenExists(req.user.token)
			.then((response) => {
				if (response.status === 'error') {
					return res.status(401).send('HTTP401 Unauthorized : Bad API_TOKEN');
				} else {
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
				}
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		return res.status(401).send('HTTP401 Unauthorized : Not logged.');
	}
});

// GET LIST  OF MOVIES / TV SHOW FROM DB BY NAME
router.get('/getmoviedetails/:movieID', (req, res) => {
	if (req.user) {
		Check.tokenExists(req.user.token)
			.then((response) => {
				if (response.status === 'error') {
					return res.status(401).send('HTTP401 Unauthorized : Bad API_TOKEN');
				} else {
					Videos.findOne({ _id: req.params.movieID }, (err, movie) => {
						if (movie) {
							res.json({ status: 'success', data: movie });
						} else {
							res.json({ status: 'error', data: [ { msg: 'An error occured.' } ] });
						}
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
