const express = require('express');
const router = express.Router();
const torrentStream = require('torrent-stream');

// DOWNLOAD A NEW MOVIE
router.post('/', (req, res) => {
	const engine = torrentStream(req.body.url);

	engine.on('ready', () => {
		engine.files.forEach(function(file) {
			console.log('filename:', file.name);
			var stream = file.createReadStream();
			// stream is readable stream to containing the file content
		});
	});
});

module.exports = router;
