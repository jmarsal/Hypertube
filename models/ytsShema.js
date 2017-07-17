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
	id_movie_eztv: Number,
	title_episode: String,
	original_title: String,
	cover2: String,
	season: Number,
	episode: Number,
	quality: String,
	magnet: String,
	actors: String,
	country: String
});

moviesListSchema.plugin(mongoosePaginate);
const YtsCollection = mongoose.model('YtsCollection', moviesListSchema);
module.exports = YtsCollection;
