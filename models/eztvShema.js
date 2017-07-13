const mongoose = require('mongoose');

const moviesListSchema = mongoose.Schema({
	id_movie_eztv: Number,
	title: String,
	cover: String,
	year: Number,
	season: Number,
	episode: Number,
	quality: Number,
	magnet: String
});

const EztvCollection = mongoose.model('EztvCollection', moviesListSchema);
module.exports = EztvCollection;
