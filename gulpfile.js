var browserify = require('browserify'),
    watchify   = require('watchify'),
    gulp       = require('gulp'),
    babel      = require('gulp-babel'),
    source     = require('vinyl-source-stream'),
    sourceFile = 'app/client.jsx',
    destFolder = './public/scripts/';
    
function handleErrors(error)
{
    console.log("Error while running gulp. " + error);
}

gulp.task('browserify', function() {

  var bundler = browserify({
    // Required watchify args
    cache: {}, packageCache: {}, fullPaths: true,
    // Browserify Options
    entries: [sourceFile],
    extensions: ['.js', '.jsx'],
    debug: true
  });

  var bundle = function() {
    console.log('gulp is working...');
    
    var result = bundler
      .transform("babelify", {presets: ["es2015", "react"]})
      .bundle()
      .on('error', handleErrors)
      .pipe(source(sourceFile))
      .pipe(gulp.dest(destFolder))
      .on('end', function(){ console.log('Done!! :D @ ' + new Date().toString() ); });
     
     return result;
  };

  /*if(global.isWatching) {*/
    bundler = watchify(bundler);
    bundler.on('update', bundle);
  /*}*/

  return bundle();
});

gulp.task('babel', 
    function()
    {
      gulp.src(sourceFile)
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(gulp.dest('dist'))
    }
);

gulp.task('default', ['babel', 'browserify']);