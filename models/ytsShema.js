const mongoose = require('mongoose');

const moviesListSchema = mongoose.Schema({
	title: String,
	cover: String,
	year: Number,
	rating: Number,
	imdb_code: String,
	runtime: Number,
	genres: [ String ],
	summary: String
});

const YtsCollection = mongoose.model('YtsCollection', moviesListSchema);
module.exports = YtsCollection;
