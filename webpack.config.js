var webpack = require('webpack');

module.exports = {
	output: {
		filename: 'app.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	// plugins: [
	// 	new webpack.optimize.UglifyJsPlugin()
	// ],
	devtool: 'source-map'
};
