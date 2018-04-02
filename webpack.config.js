const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function(env, argv) {
	const copyStaticFiles = [
		{ from: 'manifest.json' },
		{ from: 'assets/*' },
		{ from: 'assets/js/browser-polyfill.min.js', to: 'js/' },
		{ from: 'src/options/index.html', to: 'options.html' },
	];
	argv.mode == 'development' &&
		copyStaticFiles.push({ from: 'assets/js/browser-polyfill.min.js.map', to: 'js/' });

	return {
		devtool: argv.mode == 'development' ? 'cheap-module-source-map' : 'none',
		entry: {
			content_script: path.join(__dirname, 'src/content_script.ts'),
			options: path.join(__dirname, 'src/options/index.ts'),
			background: path.join(__dirname, 'src/background.ts'),
		},
		output: {
			path: path.join(__dirname, 'build/'),
			filename: 'js/[name].js',
		},
		resolve: {
			// Add `.ts` and `.tsx` as a resolvable extension.
			extensions: ['.ts', '.tsx', '.js'],
		},
		module: {
			rules: [
				// all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
				{ test: /\.tsx?$/, loader: 'ts-loader' },
				{
					test: require.resolve('arrive'),
					loader: 'imports-loader?this=>window',
				},
			],
		},
		plugins: [
			new CopyWebpackPlugin(copyStaticFiles),
		],
	};
};
