/*

REQUIREMENTS:

yarn

CD TO PROJECT FOLDER AND RUN WITH:
yarn

THEN
gulp

*/


const argv = process.argv.slice(2);

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const minifyCSS = require('gulp-minify-css');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const notifier = require('node-notifier');
const nodeSSI = require('node-ssi');
const inlineCss = require('inline-css');
const fs = require('fs');

const buildDirectory = 'build';

const ssi = new nodeSSI({
    baseDir: './',
    encoding: 'utf-8',
    payload: {
        v: 5
    }
});

gulp.task('js', function () {
  return gulp.src([
		  "js/*"
	])
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .on('error', function(e) {
      	console.log('>>> JS Error', e.message);
      	notifier.notify({
		  	message: 'Error processing JS',
		  	urgency: 'critical'
		});
      	// emit here
      	this.emit('end');
    })
	.pipe(concat('app.min.js')) // the name of the resulting file
	.pipe(uglify({
	  preserveComments: "some"
	}))
	.pipe(gulp.dest(buildDirectory)) // the destination folder
	.pipe(notify({
	  	message: 'Finished processing JS',
		urgency: 'low'
	}))
	.pipe(browserSync.stream());
});

gulp.task('scss', function () {
  return gulp.src([
			"scss/*"        
	])
  	.pipe(sass.sync())
    .on('error', function(e) {
      	console.log('>>> SCSS Error', e.message);
      	notifier.notify({
		  	message: 'Error processing SCSS',
		  	urgency: 'critical'
		});
      	// emit here
      	this.emit('end');
    })  	
	.pipe(concat('app.min.css')) // the name of the resulting file
	.pipe(minifyCSS())
	.pipe(autoprefixer({
	  browsers: ['last 8 versions'],
	  cascade: false
	}))
	.pipe(gulp.dest(buildDirectory)) // the destination folder
	.pipe(notify({
	  	message: 'Finished processing SCSS',
		urgency: 'low'
	}))
	.pipe(browserSync.stream());
});

gulp.task('html', function () {
  return gulp.src([
		"*.html",  
		"includes/*.html",  
	])
	.pipe(browserSync.stream());
});

gulp.task('watch', function () {
  	gulp.watch('js/**/*.js', ['js']);
  	gulp.watch('scss/**/*.scss', ['scss']);
  	gulp.watch(['*.html', 'includes/*.html'], ['html']);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            middleware: [
	            function (req, res, next) { // SSI & Inline
	            	if(/^(.*)\.html$/.test(req.url))
	            	{	
						ssi.compileFile(__dirname + req.url, {}, function(err, content) {
							if(argv.indexOf('--inline-css') > -1)
	            			{
						    	inlineCss(content, {
				        			url: 'file://' + __dirname + '/'
				        		})
		    					.then(function(html) { 
		    						res.end(html);

		    						if(argv.indexOf('--build-html') > -1)
	            					{
	            						fs.writeFile(
	            							__dirname + '/' + buildDirectory + req.url,
	            							html,
	            							'utf8',
	            							function()
	            							{
	            								notifier.notify({
												  	message: 'Finished building HTML',
												  	urgency: 'low'
												});
	            							}
	            						);
	            					}
		    					});
			            	} else {
			            		res.end(content);
			            	}
						});
	            	} else {
	            		next();
	            	}

	            }
            ]
        },

    });
});


gulp.task('default', ['js', 'scss', 'html', 'watch', 'browser-sync']);













// dead ones

// const connect = require('gulp-connect');
// const connectSSI = require('connect-ssi');
// const port = 8080;
// const liveReloadPort = 35729;


// gulp.task('html', function () {
//   gulp.src('./*.html')
// 	.pipe(connect.reload());
// });
 

// gulp.task('connect', function() {
//   connect.server({
// 	root: './',
// 	port: port,
// 	livereload: {
// 	  port: liveReloadPort
// 	},
// 	middleware: function() {
// 		return [
// 		  connectSSI({
// 			baseDir: __dirname,
// 			ext: '.html'
// 		  })
// 		];
// 	}
//   });
// });

// gulp.task('default', ['js', 'scss', 'watch', 'html', 'connect']);