const express = require('express');
const router = express.Router();
const request = require('request');
const imdb = require('imdb-api');

const YtsCollection = require('../models/ytsShema');
const EztvCollection = require('../models/eztvShema');

function parseJsonEztv(json) {
	const wordsToRemove = [
		'x264',
		'WEB',
		'h264',
		'PDTV',
		'XviD',
		'MP3',
		'avi',
		'EZTV',
		'BBC',
		'HDTV',
		'AAC',
		'mkv',
		'PROPER',
		'mp4',
		'READNFO'
	];
	let title = json.title,
		response = {};

	for (i = 0; i < wordsToRemove.length; i++) {
		title = title.replace(wordsToRemove[i], '');
	}

	const seasonBased = /S?0*(\d+)?[xE]0*(\d+)/; // Match saison / episode si existant
	const dateBased = /(\d{4}).(\d{2}.\d{2})/;
	const vtv = /(\d{1,2})[x](\d{2})/;
	const dateYearBased = /(190[0-9]|200[0-9]|201[0-7])/; // Match la date de sortie entre 1900 && 2017 si existante
	const imdbBased = /\/title\/(.*)\//; // Match imdb code si existant
	const minusWordBased = /-(.*)/;
	let titleRegex = json.title.match(/(.+) s?(\d+)[ex](\d+)(e(\d+))?(.*)/i);

	if (titleRegex) {
		response.title = titleRegex[1];
		response.season = parseInt(titleRegex[2]);
		response.episode = parseInt(titleRegex[3]);
		response.episode2 = parseInt(titleRegex[5]);
		response.episodeTitle = titleRegex[6].trim();
		response.proper = response.episodeTitle.toLowerCase().indexOf('proper') >= 0;
		response.repack = response.episodeTitle.toLowerCase().indexOf('repack') >= 0;
		for (i = 0; i < wordsToRemove.length; i++) {
			response.episodeTitle = response.episodeTitle.replace(wordsToRemove[i], '').trim();
		}
		const removeWord = response.episodeTitle.match(minusWordBased);

		if (removeWord) {
			response.episodeTitle = response.episodeTitle.replace(removeWord[0], '').trim();
		}
	}

	// Recupere et supprime la qualite du titre si existante
	response.quality = json.title.match(/(\d{3,4})p/) ? json.title.match(/(\d{3,4})p/)[0] : '480p';
	if (!titleRegex) {
		title = title.replace(response.quality, '');
	} else {
		response.episodeTitle = response.episodeTitle.replace(response.quality, '');
	}

	// Recupere l'annee si existante
	response.year = json.title.match(dateYearBased) ? json.title.match(dateYearBased)[0] : -1;
	if (!titleRegex) {
		title = title.replace(response.year, '');
	}

	// Recupere imdb code et supprime du titre si existant
	response.imdb_code = json.title.match(imdbBased) ? json.title.match(imdbBased)[0] : (response.imdb_code = 'NaN');
	if (!titleRegex) {
		title = title.replace(response.imdb_code, '');
	}

	// // Recupere l'id
	response.idEztv = json.id;

	// // Recupere images
	response.largeImage = json.large_screenshot;
	response.smallImage = json.small_screenshot;

	// Recupere le nb de seeds
	response.peers = json.peers;
	// Recupere le nb de peers
	response.seeds = json.seeds;

	// Recupere le lien magnet
	response.magnet = json.magnet_url;

	if (!titleRegex) {
		// Recupere et supprime du titre le num de Saison et le num de l'episode
		if (title.match(seasonBased) || title.match(vtv)) {
			response.season = parseInt(title.match(seasonBased)[1], 10);
			response.episode = parseInt(title.match(seasonBased)[2], 10);
			title = title.replace(title.match(/S[0-9][0-9]/i), '').replace(title.match(/E[0-9][0-9]/i), '');
		} else if (title.match(dateBased)) {
			response.season = title.match(dateBased)[1];
			response.episode = title.match(dateBased)[2].replace(/\s/g, '-');
		}

		// Recupere le titre avec la var title nettoyer de tout le reste
		response.title = title.trim();
	}

	return response;
}

function saveEztvListInCollection(json, allJson) {
	const response = parseJsonEztv(json);
	let cover = '';

	if (response.largeImage && response.largeImage.length) {
		cover = response.largeImage.replace('//', '');
	} else if (response.smallImage && response.smallImage.length) {
		cover = response.smallImage.replace('//', '');
	} else {
		cover = '/movies/not-available.png';
	}
	const movie = new EztvCollection({
		id_movie_eztv: response.idEztv,
		imdb_code: response.imdb_code,
		rating: 0,
		title: response.title.trim(),
		title_episode: response.episodeTitle ? response.episodeTitle.trim() : 'NaN',
		original_title: json.title,
		cover: cover,
		year: response.year,
		season: response.season ? response.season : -1,
		episode: response.episode ? response.episode : -1,
		quality: response.quality,
		magnet: response.magnet
	});

	EztvCollection.findOne({ id_movie_eztv: movie.id_movie_eztv }, (err, res) => {
		if (err) {
			console.error(err);
		}
		if (!res && movie.season != -1 && movie.episode != -1) {
			imdb
				.get(movie.title, { apiKey: '7c212437', timeout: 300000 })
				.then((things) => {
					// debugger;
					if (things.series == false) {
						// debugger;
						movie.imdb_code = things.imdbid;
						movie.year = things.year;
						movie.rating = things.rating;
					} else {
						things.episodes().then(console.log).catch((err) => {
							console.error('episode : ', err);
						});
					}
				})
				.catch((err) => {
					// console.error('get : ', err);
				});
			// movie.save();
		} else if (!res && (movie.season == -1 || movie.episode == -1)) {
			// allJson.torrents_count -= 1;
		}
	});
}

function saveYtsListInCollection(json) {
	const movie = new YtsCollection({
		title: json['title'],
		cover: json['medium_cover_image'],
		year: json['year'],
		rating: json['rating'],
		imdb_code: json['imdb_code'],
		runtime: json['runtime'],
		genres: json['genres'],
		summary: json['summary'],
		torrent: json.torrents
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
			source === 'yts'
				? saveYtsListInCollection(json.data.movies[j])
				: saveEztvListInCollection(json.torrents[j], json);
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
