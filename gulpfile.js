
var pkg = require('./package.json');

var gulp = require('gulp');

var webpack = require('webpack');

var webpackStream = require('webpack-stream');

var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');


// todo занести в webpack
var stylus = require('gulp-stylus');
var csso = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');



gulp.task( 'build', function() {
        return gulp
            .src('./src/module.js')
            .pipe(webpackStream({
                module: {
                    loaders: [
                        // https://github.com/babel/babel-loader
                        {test: /\.js$/, loader: 'babel'}
                    ]
                },
                plugins: [

                    new ngAnnotatePlugin({
                        add: true
                    }),

                    //new webpack.optimize.UglifyJsPlugin({
                    //    compress: {
                    //        warnings: false
                    //    }
                    //})

                ],
                devtool: 'source-map',
                debug: true,
                output: {
                    library: pkg.name,
                    libraryTarget: 'umd',
                    filename: pkg.name + '.min.js'
                }
            }))

            .pipe(gulp.dest('./dist'));
    }
);


gulp.task( 'styl', function() {

    return gulp
        .src('./src/'+  pkg.name +'.styl')
        .pipe(stylus())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Explorer >= 8', 'Safari >= 5'],
            cascade: false
        }))
        .pipe(csso())
        .pipe(gulp.dest('./dist'));

});



gulp.task('watch', ['build', 'styl'],function() {
        gulp.watch(['./src/**/*'], ['build']);
        gulp.watch(['./src/**/*.styl'], ['styl']);
    }
);


gulp.task('default', ['build', 'styl']);