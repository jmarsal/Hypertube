const mongoose = require('mongoose'),
	mongoosePaginate = require('mongoose-paginate');

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

seasonShema.plugin(mongoosePaginate);
const Season = mongoose.model('Season', seasonShema);
module.exports = Season;
