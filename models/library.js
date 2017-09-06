const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const moviesListSchema = mongoose.Schema({
	title: String,
	cover: String,
	year: Number,
	rating: Number,
	imdb_code: String,
	runtime: Number,
	genres: [ String ],
	summary: String,
	torrent: [],
	filePath: String,
	downloadDate: String,
	lastWatchingDate: Number,
	isDownloading: { type: Boolean, default: false },
	id_movie_eztv: Number,
	title_episode: String,
	original_title: String,
	cover2: String,
	season: Number,
	episode: Number,
	quality: String,
	actors: String,
	magnet: String,
	country: String,
	comments: Array
});

moviesListSchema.plugin(mongoosePaginate);
const Library = mongoose.model('Library', moviesListSchema);
module.exports = Library;
