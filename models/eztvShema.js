const mongoose = require('mongoose');

const moviesListSchema = mongoose.Schema({
	id_movie_eztv: Number,
	imdb_code: String,
	rating: Number,
	title: String,
	title_episode: String,
	original_title: String,
	cover: String,
	cover2: String,
	year: Number,
	season: Number,
	episode: Number,
	quality: String,
	actors: String,
	country: String,
	genres: [ String ],
	plot: String,
	magnet: String,
	filePath: String,
	downloadDate: String
});
const EztvCollection = mongoose.model('EztvCollection', moviesListSchema);
module.exports = EztvCollection;
