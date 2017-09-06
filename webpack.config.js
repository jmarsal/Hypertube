let path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: './src/client.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public')
	},
	resolve: {
		modules: [ path.resolve(__dirname, 'src'), 'node_modules' ]
	},
	watch: true,
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	}
};
