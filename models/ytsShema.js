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
	downloadDate: String
});

moviesListSchema.plugin(mongoosePaginate);
const YtsCollection = mongoose.model('YtsCollection', moviesListSchema);
module.exports = YtsCollection;
