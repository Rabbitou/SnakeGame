const path = require('path');

module.exports = {
	target: ['web'],
	mode: 'development',
	entry: {
		main: './index.ts',
		// cl: './src/frontend/cl.ts',
		// server: './src/server/server.ts',
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
				// include: [path.resolve(__dirname, 'src/frontend')]
			},
		],
	},
	devServer : {
		static: {
			directory: path.resolve(__dirname, 'dist'),
		},
		port: 3030,
		open: true,
		hot: true,
		compress: true,
		historyApiFallback: true,
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	output: {
		publicPath: 'dist',
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	}
}