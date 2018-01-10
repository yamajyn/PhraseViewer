var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var plumber = require("gulp-plumber");
var notify = require("gulp-notify");
var browserSync = require("browser-sync");
var data = require('gulp-data');
var fs = require('fs');


var paths = {
  'scss': './src/sass/',
  'css': './docs/css/',
  'pug': './src/pug/',
  'html': './docs/',
  'js': './docs/js/',
  'json': '/src/json/'
}

//sass to css
gulp.task('sass', function(){
  gulp.src(paths.scss + '**/*.scss')
    .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.stream());
});

//pug to html
gulp.task('pug', function() {
  gulp.src(
    [paths.pug + '/**/*.pug', '!' + paths.pug + '/**/_*.pug']
  )
    .pipe(plumber({
              errorHandler: notify.onError("Error: <%= error.message %>")
          }))
    .pipe(data(function(file){
      var dirname = "./src/json/";
      var files = fs.readdirSync(dirname);
      var json = {};
      files.forEach(function(filename){
        json[filename.replace(".json","")] = require(dirname + filename);
      });
      return {data:json};
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.html))
});

gulp.task('default', ['sass', 'browser-sync', 'pug', 'watch']);

gulp.task('watch', () => {
    gulp.watch(paths.scss + '**/*.scss',['sass']);
    gulp.watch(paths.pug + '**/*.pug', ['pug']);
    gulp.watch(paths.pug + '**/template/*.pug', ['pug']);
    gulp.watch(paths.json + '**/*.json', ['json'])
});
 


gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: paths.html
        }
    });
    gulp.watch(paths.js + "**/*.js",    ['reload']);
    gulp.watch(paths.html + "*.html",   ['reload']);
    gulp.watch(paths.css + "**/*.css", ['reload']);
});

gulp.task('reload', () => {
    browserSync.reload();
});
