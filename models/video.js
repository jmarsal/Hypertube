const mongoose = require('mongoose'),
	mongoosePaginate = require('mongoose-paginate');

const videoShema = mongoose.Schema({
	type: {
		type: String,
		enum: [ 'movie', 'serie' ]
	},
	provider: {
		type: String,
		enum: [ 'yts', 'eztv' ]
	},
	imdb_code: {
		type: String,
		trim: true
	},
	director: {
		type: String,
		trim: true
	},
	producer: {
		type: String,
		trim: true
	},
	title: {
		type: String,
		trim: true
	},
	title2: {
		type: String,
		trim: true
	},
	season: {
		type: Number
	},
	episode: {
		type: Number
	},
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
	runtime: {
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
	quality: [
		{
			type: String,
			trim: true
		}
	],
	actors: {
		type: String,
		trim: true
	},
	country: {
		type: String,
		trim: true
	},
	torrent: [],
	magnet: [
		{
			type: String,
			trim: true
		}
	],
	filePath: {
		type: String,
		trim: true
	},
	downloadDate: {
		type: String,
		trim: true
	},
	lastWatchingDate: {
		type: Number
	},
	isDownloading: {
		type: Boolean,
		default: false
	},
	comments: {
		type: Array
	},
	seeds: {
		type: Number
	},
	subtitleFr: {
		type: String
	},
	subtitleEn: {
		type: String
	},
	views: {
		type: Array
	}
});

videoShema.plugin(mongoosePaginate);
const Video = mongoose.model('Video', videoShema);
module.exports = Video;
