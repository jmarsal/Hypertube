const mongoose = require('mongoose');

const seasonShema = mongoose.Schema({
	number: {
		type: Number,
		default: 1,
		min: 1
	},
	episodes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Video'
		}
	]
});

const Season = mongoose.model('Season', seasonShema);
module.exports = Season;
