const mongoose = require('mongoose');

const moviesListSchema = mongoose.Schema({
	id_movie_eztv: Number,
	imdb_code: String,
	rating: Number,
	title: String,
	title_episode: String,
	original_title: String,
	cover: String,
	year: Number,
	season: Number,
	episode: Number,
	quality: String,
	magnet: String
});

const EztvCollection = mongoose.model('EztvCollection', moviesListSchema);
module.exports = EztvCollection;
