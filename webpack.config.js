const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	entry: {
		content_script: path.join(__dirname, 'src/content_script.ts'),
		options: path.join(__dirname, 'src/options/index.ts'),
		background: path.join(__dirname, 'src/background.ts'),
	},
	output: {
		path: path.join(__dirname, 'build/'),
		filename: 'js/[name].js',
	},
	module: {
		loaders: [
			{
				exclude: /node_modules/,
				test: /\.tsx?$/,
				loader: 'ts-loader',
			},
			{
				test: require.resolve('arrive'),
				loader: 'imports-loader?this=>window',
			},
		],
	},
	plugins: [
		new CopyWebpackPlugin([
			{ from: 'manifest.json' },
			{ from: 'assets/' },
			{ from: 'src/options/index.html', to: 'options.html' },
		]),
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
};
