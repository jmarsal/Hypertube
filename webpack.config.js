const path = require('path'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
	dev = process.env.NODE_ENV === 'dev';

let cssLoaders = [ 'style-loader', { loader: 'css-loader', options: { importLoaders: 1, minimize: !dev } } ];

if (!dev) {
	cssLoaders.push({
		loader: 'postcss-loader',
		options: {
			plugins: (loader) => [
				require('autoprefixer')({
					browsers: [ 'chrome >= 46', 'firefox >= 41' ]
				})
			]
		}
	});
}

let config = {
	entry: './src/client.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public')
	},
	resolve: {
		modules: [ path.resolve(__dirname, 'src'), 'node_modules' ]
	},
	watch: dev,
	devtool: dev ? 'cheap-module-eval-source-map' : false,
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: [ 'babel-loader' ]
			},
			{
				test: /\.css$/,
				// exclude: /(node_modules|bower_components)/,
				use: [ 'style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }, 'postcss-loader' ]
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [ ...cssLoaders, 'sass-loader' ]
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: '[name].css',
			disable: dev
		})
	]
};

if (!dev) {
	config.plugins.push(
		new UglifyJSPlugin({
			sourceMap: false
		})
	);
}

module.exports = config;
