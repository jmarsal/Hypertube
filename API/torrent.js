const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const torrentStream = require('torrent-stream');
const ffmpeg = require('fluent-ffmpeg');
const pump = require('pump');
const mime = require('mime');
const download = require('download');
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS('OSTestUserAgentTemp');
const srt2vtt = require('srt-to-vtt');

const Library = require('../models/video.js');

dev = process.env.NODE_ENV === 'development' ? true : false;

function findMovie(_id, quality) {
	return new Promise((resolve, reject) => {
		Library.findOne({ _id: _id }, (err, movie) => {
			if (movie) {
				if (dev) console.log('Found on Library');
				let magnet = undefined;

				if (!movie.magnet[0]) {
					for (let k in movie.torrent) {
						if (movie.torrent[k].quality === quality) {
							magnet = 'magnet:?xt=urn:btih:' + movie.torrent[k].hash;
						}
					}

					if (magnet === undefined) magnet = 'magnet:?xt=urn:btih:' + movie.torrent[0].hash;

					movie.magnet[0] = magnet;
				} else {
					magnet = movie.magnet[0];
				}

				resolve(movie);
			} else {
				reject('There is no movies with this ID');
			}
		});
	});
}

function streamFile(res, file, start, end, mimetype, fileName) {
	if (mimetype === 'video/ogg' || mimetype === 'video/mp4') {
		let stream = file.createReadStream({
			start: start,
			end: end
		});
		pump(stream, res);
	} else {
		if (dev) console.log('Conversion starting...');

		let torrent = file.createReadStream({
			start: start,
			end: end
		});

		let stream = ffmpeg(torrent)
			.videoCodec('libvpx')
			.audioCodec('libvorbis')
			.format('mp4')
			.audioBitrate(128)
			.videoBitrate(1024)
			.outputOptions([ '-deadline realtime', '-cpu-used -5' ])
			.on('progress', (progress) => {
				//console.log('Converting ' + progress.percent + '% done');
			})
			.on('error', (err, stdout, stderr) => {
				if (dev) console.log('Cannot process video: ' + err.message);
				if (dev) console.log('ffmpeg stdout: ' + stdout);
				if (dev) console.log('ffmpeg stderr: ' + stderr);
			})
			.on('end', () => {
				if (dev) console.log('Converting is done !');
			})
			.save('/goinfre/' + fileName + '.mp4');

		pump(stream, res);
	}
}

//GET SUBTITLES
router.get('/subtitles/:_id', (req, res) => {
	Library.findOne({ _id: req.params._id }, (err, movie) => {
		if (movie) {
			OpenSubtitles.search({
				sublanguageid: [ 'fre', 'eng' ].join(),
				extensions: 'srt',
				season: movie.season ? movie.season : null,
				episode: movie.episode ? movie.episode : null,
				limit: 'all',
				imdbid: movie.imdb_code
			})
				.then((subtitles) => {
					let subtitlesPath = __dirname + '/../public/subtitles';

					if (subtitles.en && subtitles.en[0]) {
						download(subtitles.en[0].url, subtitlesPath)
							.then(() => {
								fs.stat(subtitlesPath + '/' + subtitles.en[0].filename, (err) => {
									if (err === null) {
										movie.subtitleEn =
											'/' + path.basename(subtitles.en[0].filename, '.srt') + '.vtt';
										fs
											.createReadStream(subtitlesPath + '/' + subtitles.en[0].filename)
											.pipe(srt2vtt())
											.pipe(fs.createWriteStream(subtitlesPath + movie.subtitleEn));
										fs.unlinkSync(subtitlesPath + '/' + subtitles.en[0].filename);
									}

									if (subtitles.fr && subtitles.fr[0].url) {
										download(subtitles.fr[0].url, subtitlesPath)
											.then(() => {
												fs.stat(subtitlesPath + '/' + subtitles.fr[0].filename, (err) => {
													if (err === null) {
														movie.subtitleFr =
															'/' +
															path.basename(subtitles.fr[0].filename, '.srt') +
															'.vtt';
														fs
															.createReadStream(
																subtitlesPath + '/' + subtitles.fr[0].filename
															)
															.pipe(srt2vtt())
															.pipe(
																fs.createWriteStream(subtitlesPath + movie.subtitleFr)
															);

														fs.unlinkSync(subtitlesPath + '/' + subtitles.fr[0].filename);
													}

													movie.save();
													res.json({ status: 'success', data: movie });
												});
											})
											.catch((err) => {
												console.error(err);
											});
									} else {
										movie.save();
										res.json({ status: 'success', data: movie });
									}
								});
							})
							.catch((err) => {
								console.error(err);
							});
					} else {
						res.json({ status: 'success', data: movie });
					}
				})
				.catch((err) => {
					console.error(err);
				});
		} else {
			res.json({ status: 'error' });
		}
	});
});

//CHECK IF FILE EXISTS
function checkFileExists(movie, quality) {
	return new Promise((resolve, reject) => {
		if (movie.filePath && movie.filePath[quality]) {
			fs.stat(movie.filePath[quality], (err) => {
				if (err) {
					movie.filePath = undefined;
					movie.downloadPercent[quality] = 0;
					movie.markModified('downloadPercent');
					movie
						.save()
						.then(() => {
							resolve();
						})
						.catch((err) => {
							console.error(err);
							reject();
						});
				} else {
					resolve();
				}
			});
		} else {
			resolve();
		}
	});
}

// DOWNLOAD A NEW MOVIE
router.get('/:_id/:quality', (req, res) => {
	if (dev) console.log('Torrent process begins...');

	let quality = req.params.quality;

	findMovie(req.params._id, quality)
		.then((movie) => {
			checkFileExists(movie, quality)
				.then(() => {
					movie.lastWatchingDate = Date.now();
					if (movie.views.indexOf(req.user.username) < 0) {
						movie.views.push(req.user.username);
					}
					movie.save();

					if (!movie.filePath || (movie.filePath && !movie.filePath[quality])) {
						if (dev) console.log('No file path yet, preparing to download...');
						if (dev) console.log('Magnet: ' + movie.magnet[0]);
						const engine = torrentStream(movie.magnet[0], {
							connections: 100,
							uploads: 10,
							path: '/goinfre', //'public/movies',
							verify: true,
							trackers: [
								'udp://tracker.leechers-paradise.org:6969/announce',
								'udp://tracker.pirateparty.gr:6969/announce',
								'udp://tracker.coppersurfer.tk:6969/announce',
								'http://asnet.pw:2710/announce',
								'http://tracker.opentrackr.org:1337/announce',
								'udp://tracker.opentrackr.org:1337/announce',
								'udp://tracker1.xku.tv:6969/announce',
								'udp://tracker1.wasabii.com.tw:6969/announce',
								'udp://tracker.zer0day.to:1337/announce',
								'udp://p4p.arenabg.com:1337/announce',
								'http://tracker.internetwarriors.net:1337/announce',
								'udp://tracker.internetwarriors.net:1337/announce',
								'udp://allesanddro.de:1337/announce',
								'udp://9.rarbg.com:2710/announce',
								'udp://tracker.dler.org:6969/announce',
								'http://mgtracker.org:6969/announce',
								'http://tracker.mg64.net:6881/announce',
								'http://tracker.devil-torrents.pl:80/announce',
								'http://ipv4.tracker.harry.lu:80/announce',
								'http://tracker.electro-torrent.pl:80/announce'
							]
						});

						if (movie.provider === 'yts') {
							movie.magnet = undefined;
							movie.save();
						}

						let fileName = undefined;
						let fileExt = undefined;
						let fileSize = undefined;

						engine
							.on('ready', () => {
								engine.files.forEach((file) => {
									if (
										path.extname(file.name) !== '.mp4' &&
										path.extname(file.name) !== '.avi' &&
										path.extname(file.name) !== '.mkv' &&
										path.extname(file.name) !== '.ogg'
									) {
										file.deselect();
										return;
									}

									if (dev) console.log('file name: ' + file.name);
									if (dev) console.log('Path: ', file.path.replace(path.extname(file.name), ''));
									if (dev) console.log('File type: ', mime.lookup(file.name));
									if (dev) console.log('Download started...');

									let mimetype = mime.lookup(file.name);
									let isVideo = mimetype.split('/')[0];
									if (isVideo === 'video') {
										file.select();
									}

									fileSize = file.length;

									let total = file.length;
									let start = 0;
									let end = total - 1;

									fileName = file.path.replace(path.extname(file.name), '');
									fileExt = path.extname(file.name);

									if (mimetype !== 'video/ogg' && mimetype !== 'video/mp4') {
										if (dev) console.log('Changing mimetype ' + mimetype + ' to video/mp4...');
										mimetype = 'video/mp4';
									}

									if (req.headers.range) {
										let range = req.headers.range;
										let parts = range.replace(/bytes=/, '').split('-');
										let newStart = parts[0];
										let newEnd = parts[1];

										start = parseInt(newStart, 10);
										end = newEnd ? parseInt(newEnd, 10) : total - 1;
										let chunksize = end - start + 1;

										res.writeHead(206, {
											'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
											'Accept-Ranges': 'bytes',
											'Content-Length': chunksize,
											'Content-Type': mimetype,
											Connection: 'keep-alive'
										});

										streamFile(res, file, start, end, mimetype, fileName);
									} else {
										res.writeHead(200, {
											'Content-Length': total,
											'Content-Type': mimetype
										});

										streamFile(res, file, start, end, mimetype, fileName);
									}
								});
							})
							.on('download', () => {
								const percent = Math.round(engine.swarm.downloaded / fileSize * 100 * 100) / 100;

								Library.findOne({ _id: movie._id }, (err, tmpMovie) => {
									if (tmpMovie) {
										if (!tmpMovie.downloadPercent) tmpMovie.downloadPercent = new Object();

										if (
											!tmpMovie.downloadPercent[quality] ||
											tmpMovie.downloadPercent[quality] < percent
										) {
											tmpMovie.downloadPercent[quality] = percent;
										}

										tmpMovie.markModified('downloadPercent');
										tmpMovie.save().catch((err) => {});
									} else {
										if (dev) console.log('There is no movie with this ID');
									}
								});
							})
							.on('idle', () => {
								if (dev) console.log('Download is done !');
								if (!movie.filePath) movie.filePath = new Object();
								movie.filePath[quality] = '/goinfre/' + fileName + fileExt;
								movie.downloadDate = new Date();
								movie.save();
							});
					} else {
						if (dev) console.log('This movie is already downloaded');
						if (movie.provider === 'yts') {
							movie.magnet = undefined;
							movie.save();
						}

						let stats = fs.statSync(movie.filePath[quality]);
						let total = stats['size'];
						let start = 0;
						let end = total - 1;
						let mimetype = mime.lookup(movie.filePath[quality]);

						if (req.headers.range) {
							let range = req.headers.range;
							let parts = range.replace(/bytes=/, '').split('-');
							let newStart = parts[0];
							let newEnd = parts[1];

							start = parseInt(newStart, 10);
							end = newEnd ? parseInt(newEnd, 10) : total - 1;
							let chunksize = end - start + 1;

							if (dev) console.log(start + ' : ' + end);

							res.writeHead(206, {
								'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
								'Accept-Ranges': 'bytes',
								'Content-Length': chunksize,
								'Content-Type': mimetype,
								Connection: 'keep-alive'
							});

							let stream = fs.createReadStream(movie.filePath[quality], {
								start: start,
								end: end
							});
							pump(stream, res);
						} else {
							res.writeHead(200, {
								'Content-Length': total,
								Connection: 'keep-alive',
								'Content-Type': mimetype
							});

							let stream = fs.createReadStream(movie.filePath[quality], {
								start: start,
								end: end
							});
							pump(stream, res);
						}
					}
				})
				.catch((err) => {
					console.error(err);
				});
		})
		.catch((err) => {
			console.error(err);
		});
});

module.exports = router;
