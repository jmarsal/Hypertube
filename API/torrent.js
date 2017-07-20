const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const torrentStream = require('torrent-stream');
const Transcoder = require('stream-transcoder');
const mime = require('mime');
const ffmpeg = require('fluent-ffmpeg');

const Library = require('../models/library.js');

function findMovie(_id) {
	return new Promise((resolve, reject) => {
		Library.findOne({ _id: _id }, function(err, movie) {
			if (movie) {
				console.log('Found on Library');

				if (!movie.magnet) {
					movie.magnet = 'magnet:?xt=urn:btih:' + movie.torrent[0].hash;
				}

				resolve(movie);
			} else {
				reject('There is no movies with this ID');
			}
		});
	});
}

// DOWNLOAD A NEW MOVIE
router.get('/:_id', (req, res) => {
	console.log('Torrent process beginning');
	findMovie(req.params._id)
		.then((movie) => {
			if (!movie.filePath) {
				console.log('No file path yet');
				const engine = torrentStream(movie.magnet, {
					connections: 100,
					uploads: 10,
					path: 'public/movies',
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

				let fileName = undefined;
				let fileExt = undefined;

				engine
					.on('ready', () => {
						engine.files.forEach(function(file) {
							console.log('file name: ' + file.name);
							if (
								path.extname(file.name) !== '.mp4' &&
								path.extname(file.name) !== '.avi' &&
								path.extname(file.name) !== '.mkv' &&
								path.extname(file.name) !== '.ogg'
							) {
								file.deselect();
								return;
							}

							console.log(file.path.replace(path.extname(file.name), ''));
							console.log(mime.lookup(file.name));

							let mimetype = mime.lookup(file.name);
							let isVideo = mimetype.split('/')[0];
							if (isVideo === 'video') {
								file.select();
							}

							let total = file.length;
							let start = 0;
							let end = total - 1;
							fileName = file.path.replace(path.extname(file.name), '');

							if (mimetype === 'video/ogg' || mimetype === 'video/mp4') {
								fileExt = path.extname(file.name);
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

									file
										.createReadStream({
											start: start,
											end: end
										})
										.pipe(res);
								} else {
									res.writeHead(200, {
										'Content-Length': total,
										'Content-Type': mimetype
									});
									file
										.createReadStream({
											start: start,
											end: end
										})
										.pipe(res);
								}
							} else {
								console.log('Conversion starting...');

								console.log(file);

								fileExt = '.mkv'; //A CHANGER
								let torrent = file.createReadStream({
									start: 0,
									end: file.length
								});

								var convert = ffmpeg(torrent)
									.videoCodec('libvpx')
									.audioCodec('libvorbis')
									.format('webm')
									.audioBitrate(128)
									.videoBitrate(1024)
									.outputOptions([ '-threads 8', '-deadline realtime', '-error-resilient 1' ])
									.on('error', function(err) {
										console.log('An error occurred: ' + err.message);
									})
									.on('progress', function(progress) {
										console.log(
											'Processing: ' + progress.targetSize * 100 / file.length + '% done'
										);
									})
									.on('end', function() {
										console.log('Processing finished !');
									})
									.pipe(res);
							}
						});
					})
					.on('idle', () => {
						console.log('Download done !');
						movie.filePath = 'public/movies/' + fileName + fileExt;
						movie.downloadDate = new Date();
						movie.save();
					});
			} else {
				console.log('This movie is already downloaded');
				let stats = fs.statSync(movie.filePath);
				let total = stats['size'];
				let start = 0;
				let end = total - 1;
				let mimetype = mime.lookup(movie.filePath);

				if (req.headers.range) {
					let range = req.headers.range;
					let parts = range.replace(/bytes=/, '').split('-');
					let newStart = parts[0];
					let newEnd = parts[1];

					start = parseInt(newStart, 10);
					end = newEnd ? parseInt(newEnd, 10) : total - 1;
					let chunksize = end - start + 1;

					console.log(start + ' : ' + end);

					res.writeHead(206, {
						'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
						'Accept-Ranges': 'bytes',
						'Content-Length': chunksize,
						'Content-Type': mimetype,
						Connection: 'keep-alive'
					});

					fs
						.createReadStream(movie.filePath, {
							start: start,
							end: end
						})
						.pipe(res);
				} else {
					res.writeHead(200, {
						'Content-Length': total,
						Connection: 'keep-alive',
						'Content-Type': mimetype
					});
					fs
						.createReadStream(movie.filePath, {
							start: start,
							end: end
						})
						.pipe(res);
				}
			}
		})
		.catch((err) => {
			console.error(err);
		});
});

module.exports = router;
