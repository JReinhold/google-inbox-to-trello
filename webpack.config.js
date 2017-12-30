const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		content_script: path.join(__dirname, 'src/content_script.ts'),
		background: path.join(__dirname, 'src/background.ts'),
	},
	output: {
		path: path.join(__dirname, 'dist/'),
		filename: 'js/[name].js',
	},
	module: {
		loaders: [
			{
				exclude: /node_modules/,
				test: /\.tsx?$/,
				loader: 'ts-loader',
			},
		],
	},
	plugins: [new CopyWebpackPlugin([{ from: 'assets/' }])],
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
};
