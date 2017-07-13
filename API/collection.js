const express = require('express');
const router = express.Router();
const request = require('request');
const mkdirp = require('mkdirp');

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
		quality: /*json.torrents[j]['quality']*/ 0, //A parser
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
		summary: json.data.movies[j]['summary']
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

		const count = source === 'yts' ? json.data.movie_count : json.torrents_count;
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

// GET LIST OF MOVIES FROM YTS
router.post('/getMovies', (req, res) => {
	insertCollection('yts');
	insertCollection('eztv');
});
module.exports = router;
