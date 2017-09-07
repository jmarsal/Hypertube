const mongoose = require('mongoose'),
	mongoosePaginate = require('mongoose-paginate');

const serieShema = mongoose.Schema({
	imdb_code: {
		type: String,
		trim: true
	},
	type: {
		type: String,
		enum: [ 'TVShow', 'SERIE' ]
	},
	title: {
		type: String,
		trim: true
	},
	seasons: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Season'
		}
	],
	background: {
		type: String,
		trim: true
	},
	cover: {
		type: String,
		trim: true
	},
	year: {
		type: Number
	},
	rating: {
		type: Number
	},
	genres: [
		{
			type: String,
			trim: true
		}
	],
	summary: {
		type: String,
		trim: true
	},
	actors: {
		type: String,
		trim: true
	},
	country: {
		type: String,
		trim: true
	}
});

serieShema.plugin(mongoosePaginate);
const Serie = mongoose.model('Serie', serieShema);
module.exports = Serie;
