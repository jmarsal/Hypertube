const express = require('express'),
	router = express.Router(),
	request = require('request'),
	omdb = require('imdb-api'),
	Serie = require('../models/serie'),
	Season = require('../models/season'),
	Video = require('../models/video');

function addMissingHttps(pattern, url) {
	if (url.search('https:') > -1) {
		debugger;
		return url;
	}
	return url.search(pattern) > -1 ? 'https:' + url : url;
}

function getCover(response, data) {
	let cover = '';

	if (response.largeImage && response.largeImage.length && response.largeImage !== 'N/A') {
		cover = response.largeImage; //.replace('//', '');
	} else {
		cover = !data || data.poster === 'N/A' ? '/library/not-available.png' : data.poster;
	}
	return addMissingHttps('ezimg.ch', cover);
}

function fillMovie(response, data, video) {
	video.imdb_code = data.imdbid;
	video.rating = data.rating && data.rating !== 'N/A' ? data.rating : -1;
	video.summary = data.plot ? data.plot : '';
	video.actors = data.actors ? data.actors : '';
	if (data.runtime) {
		var numb = data.runtime.match(/\d/g);
		numb = numb ? numb.join('') : -1;
		video.runtime = numb;
	}

	return video;
}

function fillEpisode(data, video, response) {
	if (data.runtime) {
		var numb = data.runtime.match(/\d/g);
		numb = numb ? numb.join('') : -1;
		video.runtime = numb;
	}
	video.imdb_code = data.imdb_code || data.imdbid;
	video.title2 =
		video.title2 && video.title2.length
			? video.title2
			: data.title && data.title.length && data.title.toUpperCase() !== video.title.toUpperCase()
				? data.title
				: '';
	video.season = data.season || response.season;
	video.episode = data.episode || response.episode;
	video.rating = data.rating && data.rating !== 'N/A' ? data.rating : -1;
	video.summary = data.summary || data.plot; // pas de summary...
	video.year = data.year !== -1 ? data.year : video.year;
	video.actors = data.actors ? data.actors : '';
	video.producer = data.writer && data.writer !== 'N/A' ? data.writer : video.producer;
	video.director = data.director && data.director !== 'N/A' ? data.director : video.director;

	return video;
}

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
		'READNFO',
		'-KYR',
		'-CROOKS'
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
	response.imdb_code = json.title.match(imdbBased) ? json.title.match(imdbBased)[0] : (response.imdb_code = '');
	if (!titleRegex) {
		title = title.replace(response.imdb_code, '');
	}

	// // Recupere l'id
	response.idEztv = json.id;

	// // Recupere images
	response.largeImage = json.large_screenshot;
	// response.smallImage = json.small_screenshot;

	// Recupere le nb de seeds
	response.peers = json.peers;
	// Recupere le nb de peers
	response.seeds = json.seeds;

	// Recupere le lien magnet
	response.magnet = json.magnet_url;

	if (!titleRegex) {
		// Recupere et supprime du titre le num de Season et le num de l'episode
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

function getMissingVideoData(data, response) {
	return new Promise((resolve, reject) => {
		if (!data.series) {
			return resolve({
				video: {},
				data: data
			});
		}

		data.episodes((err, dataEpisodes) => {
			if (err) {
				return reject(err);
			}

			let saisonEpisode = dataEpisodes.find(
				(e) => e.season === response.season && e.episode === response.episode
			);

			if (!saisonEpisode) {
				return resolve({
					video: {},
					data: data
				});
			}
			const infosEpisode = {
					imdb_code: saisonEpisode.imdbid,
					season: response.season,
					episode: response.episode,
					rating: saisonEpisode.rating && saisonEpisode.rating !== 'N/A' ? saisonEpisode.rating : -1
				},
				date = new Date(saisonEpisode.released),
				year = date.getFullYear();
			infosEpisode.year = year && year !== 'NaN' ? year : -1;

			return resolve({
				video: infosEpisode,
				data: data
			});
		});
	});
}

function getMissingEpisodeDataForVideo(episodeData, video) {
	const imdb_code = video.imdb_code || video.imdbid;
	// complement episode data with imdb-code

	// ici, ne doit jamais passé
	if (!imdb_code) {
		return { video: video, data: episodeData };
	}
	return omdb.getReq({ id: imdb_code, opts: { apiKey: '7c212437' } }).then((data) => {
		// Ne doit jamais passé
		if (!data) {
			return video;
		}
		video.imdb_code = imdb_code;
		if (data.actors && data.actors !== 'N/A') {
			video.actors = data.actors;
		}
		if (data.writer && data.writer !== 'N/A') {
			video.producer = data.writer;
		}
		if (data.director && data.director !== 'N/A') {
			video.director = data.director;
		}
		if (data.name && data.name !== 'N/A' && video.title !== data.name) {
			video.title2 = data.name;
		}
		if (data.country && data.country !== 'N/A') {
			video.country = data.country;
		}
		if (data.genres && data.genres !== 'N/A') {
			video.genres = data.genres;
		}
		if (data.rating && data.rating != video.rating && data.rating !== 'N/A') {
			video.rating = parseInt(data.rating, 10);
		}
		if (data.plot && data.plot !== 'N/A' && (!video.summary || video.summary !== data.plot)) {
			video.summary = data.plot;
		}
		if (data.poster && video.cover === video.background && data.poster !== video.cover) {
			video.cover = addMissingHttps('ezimg.ch', data.poster);
		}
		if (data.year !== 'N/A' && video.year !== data.year) {
			video.year = data.year;
		}
		return { video: video, data: episodeData };
	});
}

function createVideo(response, data, infosEpisode) {
	const isSerie = data.series;

	const video = new Video({
		type: isSerie ? 'serie' : 'movie',
		title: response.title,
		provider: 'eztv',
		cover: getCover(response, data),
		quality: response.quality,
		magnet: response.magnet,
		country: data.country ? data.country : '',
		genres: data.genres ? data.genres.split(',') : '',
		background: addMissingHttps('ezimg.ch', data.poster),
		year:
			data.year && data.year !== 'NaN'
				? parseInt(data.year, 10)
				: response.year && response.year !== 'NaN' ? parseInt(response.year, 10) : -1,
		seeds: response.seeds,
		producer: data.writer && data.writer !== 'N/A' ? data.writer : '',
		director: data.director && data.director !== 'N/A' ? data.director : ''
	});

	return !isSerie
		? fillMovie(response, data, video)
		: infosEpisode.length ? fillEpisode(infosEpisode, video, data) : fillEpisode(data, video, response);
}

function saveVideoWithoutOmdbResponse(response, typeMovie) {
	const video = new Video({
		type: typeMovie,
		title: response.title,
		provider: 'eztv',
		cover: getCover(response),
		quality: response.quality,
		magnet: response.magnet,
		background: getCover(response),
		year: response.year && response.year !== 'NaN' ? parseInt(response.year, 10) : -1,
		seeds: response.seeds,
		season: response.season,
		episode: response.episode
	});
	video.save();
	return false;
}

function checkIfValidImageInResponse(response, data) {
	return new Promise((resolve, reject) => {
		response.largeImage = getCover(response);
		if (response.largeImage === '/library/not-available.png') resolve(data);

		request(response.largeImage, (err, res) => {
			if (err || res.statusCode !== 200) {
				response.largeImage = '/library/not-available.png';
				resolve(data);
			}
			resolve(data);
		});
	});
}

function saveEztvListInCollection(json) {
	const response = parseJsonEztv(json),
		title = response.title;

	return omdb
		.get(title, { apiKey: '7c212437' })
		.then((data) => {
			if (!data) {
				return saveVideoWithoutOmdbResponse(response);
			}
			return data;
		})
		.then((data) => {
			return checkIfValidImageInResponse(response, data);
		})
		.then((data) => {
			return getMissingVideoData(data, response);
		})
		.then((videoData) => {
			if (!videoData) return false; //Si pas de data au départ par omdb

			//Si on est sur un Movie ou qu'il n'y a pas cet episode sur omdb
			//return videoData qui contient { video: {}, data: data }
			if (!videoData.data.series) {
				return videoData;
			}

			return getMissingEpisodeDataForVideo(videoData.data, videoData.video);
		})
		.then((videoData) => {
			if (!videoData) return false; //Si pas de data au départ par omdb

			//Si on est sur un Movie ou qu'il n'y a pas cet episode sur omdb
			// videoData contient { video: {}, data: data }

			// Autrement videoData contient { video: video, data: data }

			if (
				//besoin de sauvegarder le video quand meme avec les infos de data et response
				response.season &&
				response.season > 0 &&
				(!videoData.data || (videoData.data && !videoData.data.series))
			) {
				// Si la video est une serie et qu'omdb le trouve en tant que film (meme nom ou confusion)
				// sauvegarde la video via la response
				return saveVideoWithoutOmdbResponse(response, 'serie');
			}

			return {
				video: createVideo(response, videoData.data, videoData.video),
				data: videoData.data
			};
		})
		.then((videoData) => {
			if (!videoData || !videoData.video.imdb_code) {
				return false;
			}

			if (!videoData.video.year || videoData.video.year === 'NaN') {
				videoData.video.year = -1;
			}
			videoData.video.save();
		})
		.catch((err) => {
			if (
				err.name === 'imdb api error' &&
				response.episode &&
				response.episode > 0 &&
				response.season &&
				response.season > 0
			) {
				saveVideoWithoutOmdbResponse(response, 'serie');
			} else if (
				err.name !== 'imdb api error' &&
				err.name !== 'RequestError' &&
				err.statusCode <= 500 &&
				err.statusCode >= 600
			) {
				console.error('EZTV Error:', err);
			}
		});
}

function saveYtsListInCollection(json) {
	if (!json.torrents) {
		return;
	}
	const video = new Video({
		type: 'movie',
		provider: 'yts',
		imdb_code: json['imdb_code'],
		title: json['title'],
		background: json['background_image'],
		cover: json['medium_cover_image'],
		year: json['year'],
		rating: json['rating'],
		runtime: json['runtime'],
		genres: json['genres'],
		summary: json['summary'],
		torrent: json.torrents,
		quality:
			json.torrents && json.torrents.length >= 1 && json.torrents[1] && json.torrents[1].quality
				? [ json.torrents[0].quality, json.torrents[1].quality ]
				: [ json.torrents[0].quality ],
		seeds:
			json.torrents && json.torrents.length >= 1 && json.torrents[1] && json.torrents[1].seeds
				? json.torrents[1].seeds
				: json.torrents[0].seeds
	});
	omdb
		.get(video.title, { apiKey: '7c212437' })
		.then((data) => {
			if (!data) {
				throw 'There is not imdbcode for ' + video.title;
			}
			video.director = data.director !== 'N/A' ? data.director : '';
			video.producer = data.writer !== 'N/A' ? data.writer : '';
			video.imdb_code = data.imdbid;
			video.year = data.year ? data.year : video.year;
			video.rating = data.rating !== 'N/A' ? data.rating : -1;
			video.actors = data.actors ? data.actors : '';
			video.country = data.country ? data.country : '';
			video.genres = data.genres ? data.genres.split(',') : '';
			video.summary = data.plot ? data.plot : '';
			video.cover = video.cover === '/library/not-available.png' ? data.poster : video.cover;
			video.cover = video.cover !== 'N/A' ? video.cover : '/library/not-available.png';

			return video;
		})
		.then((video) => video.save())
		.catch((err) => {
			if (
				err.name !== 'imdb api error' &&
				err.name !== 'RequestError' &&
				err.statusCode <= 500 &&
				err.statusCode >= 600
			) {
				console.error('YTS Error:', err);
			}
		});
}

// function timeout(ms) {
// 	return new Promise((resolve) => setTimeout(resolve, ms));
// }
// async function doInsert(method, videos) {
// 	for (const video of videos) {
// 		await timeout(200);
// 		await method(video);
// 	}
// }

async function doInsert(method, videos) {
	for (const video of videos) {
		await method(video);
	}
}

function getAndInsertVideo(page, source, cb) {
	const url =
		source === 'yts'
			? 'https://yts.ag/api/v2/list_movies.json?limit=50&page=https://yts.ag/api/v2/list_movies.json?limit=50&page='
			: 'https://eztv.ag/api/get-torrents?limit=50&page=';
	let json = {};

	return request(url + page, (err, res, body) => {
		if (!res) {
			cb(err);
		}
		if (!err && res.statusCode == 200) {
			try {
				json = JSON.parse(body);
			} catch (err) {
				return cb('yts:' + err);
			}
		}

		if (source === 'yts' ? !json.data : !json.torrents) {
			return cb(false);
		}

		const videos = source === 'yts' ? json.data.movies : json.torrents;
		const method = source === 'yts' ? saveYtsListInCollection : saveEztvListInCollection;

		// stop recursive call
		if (!videos) {
			return cb(false);
		}

		doInsert(method, videos);
		page++;

		getAndInsertVideo(page, source, cb);
	});
}

const ImportLibrary = function() {
	const sources = [ 'yts', 'eztv' ];
	// const sources = [ 'eztv' ];

	sources.forEach((source) => {
		Video.find({
			provider: source
		})
			.count()
			.exec()
			.then((count) => {
				if (count) {
					return;
				}

				getAndInsertVideo(1, source, (err) => {
					if (err) {
						console.error('ERROR WHILE INSERTING MOVIES:', err);
					} else {
						console.log(source + 'Movies collection downloaded');
					}
				});
			});
	});
};
module.exports = ImportLibrary;