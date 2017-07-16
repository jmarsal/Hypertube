const express = require('express');
const router = express.Router();
const torrentStream = require('torrent-stream');

// DOWNLOAD A NEW MOVIE
router.get('/', (req, res) => {
	const engine = torrentStream(
		'magnet:?xt=urn:btih:3cd752f7bdca459323616b2495ac36b4907853b4&dn=Wonder.Woman.2017.TC1080P.x264+&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'
	);

	engine.on('ready', () => {
		engine.files.forEach(function(file) {
			console.log('filename:', file.name);
			res.set({ 'Content-Type': 'video/mp4' });
			var readStream = file.createReadStream();
			readStream.pipe(res);
			// stream is readable stream to containing the file content
		});
	});
});

module.exports = router;
