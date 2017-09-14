const express = require('express'),
	router = express.Router(),
	Videos = require('../models/video.js');

function getSort(title, filters) {
	if (title === '') {
		if (filters === 'desc') {
			return { title: 'desc' };
		} else if (filters === 'asc') {
			return { title: 'asc' };
		} else {
			return { seeds: 'desc' };
		}
	} else {
		if (filters === 'desc') {
			return { title: 'desc' };
		} else {
			return { title: 'asc' };
		}
	}
}

function queryMongoose(title, filters) {
	let query = {};

	if (filters) {
		const type = filters.type && filters.type !== '' ? (filters.type === 'movie' ? filters.type : 'serie') : '';
		const genre = filters.genre && filters.genre !== '' ? filters.genre : '';
		const quality = filters.quality && filters.quality !== '' ? filters.quality : '';
		const season = filters.season && filters.season !== '' ? filters.season : '';
		const note = filters.note && filters.note !== '' ? filters.note : '';
		const noteActive = filters.noteActive ? filters.noteActive : false;
		const year = filters.year && filters.year !== '' ? filters.year : '';
		const yearActive = filters.yearActive ? filters.yearActive : false;

		if (title === '') {
			if (type !== '') {
				query.type = type;
			}
			if (genre !== '') {
				query.genres = genre !== 'Other' ? genre : 'N/A';
			}
			if (quality !== '') {
				query.quality = quality;
			}
			if (season !== '') {
				query.season = season;
			}
			if (note !== '' && noteActive) {
				query.rating = { $gt: note.min - 1, $lt: note.max + 1 };
			}
			if (year !== '' && yearActive) {
				query.year = { $gt: year.min - 1, $lt: year.max + 1 };
			}
			debugger;
			query = query !== {} ? query : '';
		} else {
			query.title = { $regex: title, $options: 'i' };
			if (type !== '') {
				query.type = type;
			}
			if (genre !== '') {
				query.genres = genre !== 'Other' ? genre : 'N/A';
			}
			if (quality !== '') {
				query.quality = quality;
			}
			if (season !== '') {
				query.season = season;
			}
			if (note !== '' && noteActive) {
				query.rating = { $gt: note.min, $lt: note.max };
			}
			if (year !== '' && yearActive) {
				query.year = { $gt: year.min, $lt: year.max };
			}
		}
		if (type === 'movie' && query.season) {
			delete query.season;
		}
		debugger;
		return query;
	} else {
		return title !== '' ? { title: { $regex: title, $options: 'i' } } : '';
	}
}

// GET LIST  OF MOVIES / TV SHOW FROM DB BY NAME
router.post('/getCollectionByTitleForClient', (req, res) => {
	let filters = req.body.filters,
		query = queryMongoose(req.body.title, filters),
		sort =
			filters && filters.titleOrder !== ''
				? getSort(req.body.title, filters.titleOrder)
				: getSort(req.body.title, '');
	Videos.paginate(query, {
		page: req.body.page ? req.body.page : 1,
		limit: req.body.limit ? req.body.limit : 10,
		sort: sort
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

// GET ALL GENRES IN DB FOR FILTERS
router.post('/getGenresInCollection', (req, res) => {
	Videos.distinct('genres', req.body.title ? { title: { $regex: req.body.title, $options: 'i' } } : {})
		.then((genres) => {
			genres = genres.map((genre) => (genre === 'N/A' ? 'Other' : genre));
			genres.sort();

			let allGenres = genres.map((genre) => ({ val: genre, selected: false }));
			res.json({ status: 'success', payload: allGenres });
		})
		.catch((err) => {
			if (err) {
				console.error(err);
				res.json({ status: 'error', content: err });
			}
		});
});

function sortNumberDesc(a, b) {
	return b - a;
}

function sortNumberAsc(a, b) {
	return a - b;
}

// GET ALL QUALITY IN DB FOR FILTERS
router.post('/getQualityInCollection', (req, res) => {
	Videos.distinct('quality', req.body.title ? { title: { $regex: req.body.title, $options: 'i' } } : {})
		.then((quality) => {
			let find = quality.map((e, index) => (e === '3D' ? index : false));
			let index = find.find((e) => {
				if (e !== 'false') {
					find = true;
					return e;
				}
			});
			if (index !== undefined) {
				quality.splice(index, 1);
			}
			quality = quality.map((e) => {
				return parseInt(e.match(/(\d{3,4})/)[0]);
			});

			quality.sort(sortNumberDesc);

			if (index !== undefined) {
				quality.splice(0, 0, '3D');
			}

			let allQuality = quality.map((result) => ({ val: result.toString(), selected: false }));
			res.json({ status: 'success', payload: allQuality });
		})
		.catch((err) => {
			if (err) {
				console.error(err);
				res.json({ status: 'error', content: err });
			}
		});
});

// GET ALL QUALITY IN DB FOR FILTERS
router.post('/getSeasonsInCollection', (req, res) => {
	Videos.distinct(
		'season',
		req.body.title ? { type: 'serie', title: { $regex: req.body.title, $options: 'i' } } : { type: 'serie' }
	)
		.then((resSeasons) => {
			resSeasons.sort(sortNumberAsc);
			resSeasons = resSeasons.map((season, index) => {
				if (season > 0 && season < 100) {
					return season;
				} else {
					resSeasons.splice(index - 1, 1);
				}
			});
			if (resSeasons[0] === undefined) {
				resSeasons.splice(0, 1);
			}

			let allSeasons = resSeasons.map((season) => ({ val: season.toString(), selected: false }));
			res.json({ status: 'success', payload: allSeasons });
		})
		.catch((err) => {
			if (err) {
				console.error(err);
				res.json({ status: 'error', content: err });
			}
		});
});

// GET MIN MAX IMDB NOTE IN DB FOR FILTERS
router.post('/getMinMaxImdbNote', (req, res) => {
	Videos.distinct('rating', req.body.title ? { title: { $regex: req.body.title, $options: 'i' } } : {})
		.then((rating) => {
			rating.sort(sortNumberAsc);

			if (rating[0] === -1) {
				rating.splice(0, 1);
			}

			res.json({
				status: 'success',
				payload: { min: Math.trunc(rating[0]), max: Math.trunc(rating[rating.length - 1]) }
			});
		})
		.catch((err) => {
			if (err) {
				console.error(err);
				res.json({ status: 'error', content: err });
			}
		});
});

// GET MIN MAX YEARS IN DB FOR FILTERS
router.post('/getMinMaxYears', (req, res) => {
	Videos.distinct('year', req.body.title ? { title: { $regex: req.body.title, $options: 'i' } } : {})
		.then((year) => {
			year.sort(sortNumberAsc);
			if (year[0] === -1) {
				year.splice(0, 1);
			}

			res.json({
				status: 'success',
				payload: { min: year[0], max: year[year.length - 1] }
			});
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
