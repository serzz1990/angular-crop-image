'use strict';

const path    = require('path');
const webpack = require('webpack');
const poststylus = require('poststylus');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const wsc = require('webpack-select-config');


let context = path.join(process.cwd());
let node_modules = path.join(process.cwd(), 'node_modules');



function config (PRODUCTION) {

	this.plugins = [];
	this.context = context;

	this.entry  =  {
		'angular-crop-image': './module'
	};

	this.output = {
		path: process.cwd() + '/dist/',
		filename : PRODUCTION?'[name].min.js':'[name].js'
	};


	this.module = {
		loaders : [

			{
				test   : /\.js$/,
				loaders: ['babel?presets[]=es2015'],
				include: [context]
			},

			{
				test   : /\.styl$/,
				loader: ExtractTextPlugin.extract('css?sourceMap!stylus?sourceMap&resolve url')
			},

			{
				test   : /\.jpg$|\.png$|\.svg$/i,
				loaders: ['file?name=img/[hash].[ext]']
			}

		]
	};

	this.stylus = {
		use: [
			poststylus(['autoprefixer'])
		]
	};

	if (PRODUCTION) {
		this.plugins.push(new webpack.optimize.UglifyJsPlugin({
			compress: {warnings : false}
		}));
	}


	this.plugins.push(
		new ExtractTextPlugin(PRODUCTION? '[name].min.css': '[name].css')
	);


	this.resolve = {
		moduleDirectories: ['node_modules'],
		root: [
			context,
			path.join(context, 'modules'),
			process.cwd() + '/node_modules/'
		],
		extensions : ['', '.js','.styl'],
		alias: {}
	};


	this.resolveLoader = {
		moduleDirectories: ['node_modules'],
		moduleTemplates  : ['*-loader'],
		extensions       : ['', '.js']
	};


}



module.exports = wsc({
	prod: new config(true),
	dev : new config()
});