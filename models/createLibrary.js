const express = require('express'),
	router = express.Router(),
	request = require('request'),
	omdb = require('imdb-api'),
	imdb = require('imdb'),
	Serie = require('../models/serie'),
	Season = require('../models/season'),
	Video = require('../models/video');

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
	response.imdb_code = json.title.match(imdbBased) ? json.title.match(imdbBased)[0] : (response.imdb_code = '');
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

function addMissingHttps(pattern, url) {
	return url.search(pattern) > -1 ? 'https://' + url : url;
}

function getCover(response, data) {
	let cover = '';

	if (response.largeImage && response.largeImage.length && response.largeImage !== 'N/A') {
		cover = response.largeImage.replace('//', '');
	} else if (response.smallImage && response.smallImage.length && response.smallImage !== 'N/A') {
		cover = response.smallImage.replace('//', '');
	} else {
		cover = data.poster === 'N/A' ? '/movies/not-available.png' : data.poster;
	}
	return addMissingHttps('ezimg.ch', cover);
}

function getMissingEpisodeDataForVideo(data, video) {
	return new Promise((resolve, reject) => {
		const imdb_code = video.imdb_code ? video.imdb_code : video.imdbid;

		imdb(imdb_code, (err, data) => {
			if (err || !data) {
				return resolve(video);
			}
			video.imdb_code = imdb_code;
			if (data.rating && data.rating != video.rating && data.rating !== 'N/A') {
				video.rating = parseInt(data.rating, 10);
			}
			if (data.description && (!video.summary || video.summary !== data.description)) {
				video.summary = data.description;
			}
			if (data.poster && video.cover === video.background && data.poster !== video.cover) {
				video.cover = addMissingHttps('ezimg.ch', data.poster);
			}
			// debugger;
			return resolve({ video: video, data: data });
		});
	});
}

function getMissingVideoData(data, response) {
	return new Promise((resolve, reject) => {
		if (!data.series) {
			return resolve({ data: data });
		}

		data.episodes((err, dataEpisode) => {
			if (err) {
				return reject(err);
			}
			dataEpisode.map((episode) => {
				if (episode.season == response.season && episode.episode == response.episode) {
					// return nouvel objet pour completé les donnees manquante avant le createVideo
					const infosEpisode = {
						imdb_code: episode.imdbid,
						title: episode.name,
						episode: response.episode,
						rating: episode.rating && episode.rating !== 'N/A' ? episode.rating : -1
					};
					const date = new Date(episode.released);
					const year = date.getFullYear();
					if (year) {
						infosEpisode.year = year;
					}
					//debugger;
					return resolve({
						video: infosEpisode,
						data: data
					});
				}
			});
			return resolve({ data: data });
		});
	});
}

function fillIfMovie(response, data, video) {
	//debugger;
	video.imdb_code = data.imdbid;
	video.title = response.title;
	video.year = data.year ? data.year : response.year;
	video.rating = data.rating !== 'N/A' ? data.rating : -1;
	video.summary = data.plot ? data.plot : '';

	return video;
}

function fillIfEpisode(data, video) {
	//debugger;
	video.imdb_code = data.imdb_code;
	video.title = data.title;
	video.episode = data.episode;
	video.rating = data.rating;
	video.summary = data.summary;

	return video;
}

function createVideo(response, data, infosEpisode) {
	const isSerie = data.series;

	const video = new Video({
		type: isSerie ? 'serie' : 'movie',
		provider: 'eztv',
		cover: getCover(response, data),
		quality: response.quality,
		magnet: response.magnet,
		actors: data.actors ? data.actors : '',
		country: data.country ? data.country : '',
		genres: data.genres ? data.genres.split(',') : '',
		background: addMissingHttps('ezimg.ch', data.poster),
		magnet: response.magnet,
		quality: response.quality
	});

	if (!isSerie) {
		//debugger;
		return fillIfMovie(response, data, video);
	}
	//debugger;
	return fillIfEpisode(infosEpisode, video);
}

function createNewSerie(response, data, video) {
	const serie = new Serie({
		imdb_code: data.imdbid,
		type: data.__proto__.constructor.name,
		title: response.title,
		cover: getCover(response, data),
		year: data.year ? data.year : response.year,
		rating: data.rating !== 'N/A' ? data.rating : -1,
		actors: data.actors ? data.actors : '',
		country: data.country ? data.country : '',
		genres: data.genres ? data.genres.split(',') : '',
		summary: data.plot ? data.plot : '',
		background: addMissingHttps('ezimg.ch', data.poster)
	});

	// Creer une nouvelle saison avec le numero de saison de la video
	const season = new Season({
		number: response.season
	});
	debugger;
	// ajoute le nouvel episode dans la saison
	season.episodes.push(video);
	// enregistre la saison
	season.save();
	// ajoute la nouvelle saison a la serie
	serie.seasons.push(season);
	// ajoute la serie dans la db
	return serie.save();
}

function saveNewSaison(response, serie, video) {
	const season = new Season({
		number: response.season
	});
	debugger;
	// ajoute la video dans la saison
	season.episodes.push(video);
	// enregistre la saison
	season.save();
	// ajoute la saison dans la serie
	return serie.seasons.push(season);
}

function updateSaison(serie, indexSeasonNumber, video) {
	let differenteQuality = true,
		newEpisode = true;

	// check dans tous les episodes si la video existe et si oui, check si quality est differente
	serie.seasons[indexSeasonNumber].episodes.map((episode) => {
		if (episode.episode == video.episode) {
			newEpisode = false;
			episode.quality.map((qualEpisode) => {
				video.quality.map((qualVideo) => {
					if (qualEpisode === qualVideo) {
						differenteQuality = false;
					}
				});
			});
		}
	});
	// Ajoute l'episode si la l'episode n'existe pas ou la qualite de la video n'est pas presente dans la db
	if (differenteQuality || newEpisode) {
		// Ajoute dans la serie, a la saison correspondante le nouvel episode
		debugger;
		return serie.seasons[indexSeasonNumber].episodes.push(video);
	}
	debugger;
	return false;
}

function createOrUpdateSeason(serie, response, video) {
	let find = false,
		indexSeasonNumber = 0,
		seasonId,
		serieId;

	// Check dans les seasons si le numero de saison de la video est deja presente dans la db
	serie.seasons.map((season, index) => {
		if (season.number != response.season && !find) {
			find = false;
		} else if (season.number == response.season && !find) {
			find = true;
			indexSeasonNumber = index;
			seasonId = season._id;
			serieId = res._id;
		}
	});
	// Si pas presente, creer une nouvelle saisons avec le number de la saison de la video et sauvegarde la tout dans la db
	//debugger;
	if (!find && response.season > 0) {
		return saveNewSaison(serie, response, video);
	} else {
		// Si la saison existe deja dans la db
		return updateSaison(serie, indexSeasonNumber, video);
	}
}

function saveEztvListInCollection(json, allJson) {
	const response = parseJsonEztv(json),
		title = response.title;

	omdb
		.get(title, { apiKey: '7c212437' })
		.then((data) => {
			if (!data) {
				throw 'There is not imdbcode for ' + title;
			}
			getMissingVideoData(data, response).done((videoData) => {
				return videoData;
			});
		})
		.then((videoData) => {
			debugger;
			if (!videoData.data.series) {
				return videoData.data;
			}
			getMissingEpisodeDataForVideo(videoData.data, videoData.video).done((videoData) => {
				return videoData;
			});
		})
		.then((videoData) => {
			debugger;
			createVideo(response, videoData.data, videoData.video);
			return {
				video: videoData.video,
				data: videoData.data
			};
		})
		.then((videoData) => {
			debugger;
			videoData.video.save();
			return videoData;
		})
		.then((videoData) => {
			debugger;
			if (!videoData.data.series) {
				return false;
			}
			// Cherche par l'imdb_code si la serie existe deja dans la db
			Serie.findOne({ imdb_code: videoData.data.imdb_code })
				.populate({
					path: 'seasons',
					populate: {
						path: 'episodes',
						model: 'Video'
					}
				})
				.exec()
				.then((serie) => {
					debugger;
					// Si la serie n'existe pas, l'ajoute a la db
					if (!serie && response.season > 0) {
						return createNewSerie(response, videoData.data, video);
					}
					// Si la serie est deja presente
					if (serie && response.season > 0) {
						return createOrUpdateSeason(serie, response, video);
					}
					debugger;
				});
		})
		.catch((err) => {
			// if (err.name !== 'imdb api error' && err.name !== 'RequestError') {
			// 	console.error(err);
			// }
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
				: [ json.torrents[0].quality ]
	});

	omdb
		.get(video.title, { apiKey: '7c212437' })
		.then((data) => {
			if (!data) {
				throw 'There is not imdbcode for ' + video.title;
			}
			video.imdb_code = data.imdbid;
			video.year = data.year ? data.year : video.year;
			video.rating = data.rating !== 'N/A' ? data.rating : -1;
			video.actors = data.actors ? data.actors : 'N/A';
			video.country = data.country ? data.country : 'N/A';
			video.genres = data.genres ? data.genres.split(',') : 'N/A';
			video.summary = data.plot ? data.plot : 'N/A';
			video.cover = video.cover === '/movies/not-available.png' ? data.poster : video.cover;
			video.cover = video.cover !== 'N/A' ? video.cover : '/movies/not-available.png';
			// movie.background = data.poster ? data.poster : 'N/A';

			return video;
		})
		.then((video) => {
			video.save();
		})
		.catch((err) => {
			// if (err.name !== 'imdb api error' && err.name !== 'RequestError') {
			// 	console.error(err);
			// }
		});
}

function getAndInsertVideo(i, index, source, cb) {
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

		if (source === 'yts' ? !json.data : !json.torrents) {
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

		const count = source === 'yts' ? json.data.movie_count : json.torrents_count - 65000;
		if (index >= count) {
			return cb(false);
		} else {
			getAndInsertVideo(i, index, source, cb);
		}
	});
}

const InsertCollection = function() {
	const sources = [ 'yts', 'eztv' ];

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

				getAndInsertVideo(1, 0, source, (err, data) => {
					if (err) {
						console.error(err + ' ERROR FOR ADD MOVIES COLLECTION IN DB');
					} else {
						console.log(source + 'Movies collection downloaded');
					}
				});
			});
	});
};
module.exports = InsertCollection;
