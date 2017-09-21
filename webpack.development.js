const path = require('path');
const webpack = require('webpack');
let cssLoaders = [ 'style-loader', { loader: 'css-loader', options: { importLoaders: 1 } } ];

let config = {
	entry: [
		'react-hot-loader/patch',
		'webpack-hot-middleware/client?noInfo=false',
		'./src/client.js',
		'./public/style.css'
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public')
	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DefinePlugin({
			__CLIENT__: true,
			__PRODUCTION__: false,
			'process.env.NODE_ENV': JSON.stringify('development')
		})
	],
	resolve: {
		modules: [ path.resolve(__dirname, 'src'), 'node_modules' ]
	},
	devtool: 'cheap-module-eval-source-map',
	stats: {
		errors: true,
		errorDetails: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: [ 'babel-loader' ]
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }, 'postcss-loader' ]
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: { importLoaders: 2 }
					},
					'sass-loader',
					'postcss-loader'
				]
			}
		]
	}
};
module.exports = config;
