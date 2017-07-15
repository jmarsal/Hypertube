const express = require('express');
const router = express.Router();
const request = require('request');

const YtsCollection = require('../models/ytsShema');
const EztvCollection = require('../models/eztvShema');

function saveEztvListInCollection(json, j) {
	const movie = new EztvCollection({
		id_movie_eztv: json.torrents[j]['id'],
		title: json.torrents[j]['title'],
		cover: json.torrents[j]['large_screenshot'],
		year: json.torrents[j]['date_released_unix'],
		season: /*json.torrents[j]['season']*/ 0, //A parser
		episode: /*json.torrents[j]['episode']*/ 0, //A parser
		quality: /*json.torrents[j]['quality']*/ 'A parser', //A parser
		magnet: json.torrents[j]['magnet_url']
	});
	EztvCollection.findOne({ id_movie_eztv: movie.id_movie_eztv }, (err, res) => {
		if (err) {
			console.error(err);
		}
		if (!res) {
			movie.save();
		}
	});
}

function saveYtsListInCollection(json, j) {
	const movie = new YtsCollection({
		title: json.data.movies[j]['title'],
		cover: json.data.movies[j]['medium_cover_image'],
		year: json.data.movies[j]['year'],
		rating: json.data.movies[j]['rating'],
		imdb_code: json.data.movies[j]['imdb_code'],
		runtime: json.data.movies[j]['runtime'],
		genres: json.data.movies[j]['genres'],
		summary: json.data.movies[j]['summary'],
		torrent: json.data.movies[j].torrents
	});
	YtsCollection.findOne({ imdb_code: movie.imdb_code }, (err, res) => {
		if (err) {
			console.error(err);
		}
		if (!res) {
			movie.save();
		}
	});
}

function getAndInsertListMoviesInDb(i, index, source, cb) {
	const url =
		source === 'yts'
			? 'https://yts.ag/api/v2/list_movies.json?limit=50&page=https://yts.ag/api/v2/list_movies.json?limit=50&page='
			: 'https://eztv.ag/api/get-torrents?limit=50&page=';
	let json = {};

	return request(url + i, (err, res, body) => {
		if (!res) {
			cb(true, 'Error with request dependencies');
		}
		if (!err && res.statusCode == 200) {
			try {
				json = JSON.parse(body);
			} catch (err) {
				return cb(true, 'Error with  yts = ' + err);
			}
		}

		if (source === 'yts' ? json.data.movies === undefined : json.torrents === undefined) {
			return cb(false);
		}

		const length = source === 'yts' ? json.data.movies.length : json.torrents.length;

		for (let j = 0; j < length; j++) {
			source === 'yts' ? saveYtsListInCollection(json, j) : saveEztvListInCollection(json, j);
			index++;
		}
		i++;

		const count = source === 'yts' ? json.data.movie_count : json.torrents_count - 60000;
		if (index >= count) {
			return cb(false);
		} else {
			getAndInsertListMoviesInDb(i, index, source, cb);
		}
	});
}

function insertCollection(source) {
	getAndInsertListMoviesInDb(1, 0, source, (err, data) => {
		if (err) {
			console.error(err + ' ERROR FOR ADD MOVIES COLLECTION IN DB');
		} else {
			console.log(source + 'Movies collection downloaded');
		}
	});
}

// GET LIST OF MOVIES / TV SHOW FROM YTS AND EZTV
router.post('/getMovies', (req, res) => {
	YtsCollection.count({}, (err, count) => {
		if (err) {
			console.error(err);
		}
		if (count) {
			console.log('there are ' + count + ' movies in yts Collection...');
		} else {
			insertCollection('yts');
		}
	});
	EztvCollection.count({}, (err, count) => {
		if (err) {
			console.error(err);
		}
		if (count) {
			console.log('there are ' + count + ' tv show in eztv Collection...');
		} else {
			insertCollection('eztv');
		}
	});
});

// GET LIST  OF MOVIES / TV SHOW FROM DB BY NAME
router.post('/getCollectionByTitleForClient', (req, res) => {
	const title = { title: { $regex: req.body.title, $options: 'i' } };

	YtsCollection.paginate(
		title,
		{ page: req.body.page, limit: req.body.limit, sort: { title: 'asc' } },
		(err, json) => {
			if (err) {
				console.error(err);
				res.json({ status: 'error', content: err });
			}
			if (json) {
				res.json({ status: 'success', payload: json });
			} else {
				res.json({ status: 'no_data' });
			}
		}
	);
});
module.exports = router;
