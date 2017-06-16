//gulp and plugins
var gulp   = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    KarmaServer = require('karma').Server;

var jsSrc = ['src/**/*.js',
            'test/**/*-test.js'
            ];

gulp.task('lint', function() {
    return gulp.src(jsSrc)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .on('error', function(error) {
            console.log(error);
        });
});

//https://stackoverflow.com/questions/26614738/issue-running-karma-task-from-gulp
gulp.task('test', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function() { done(); }).start();
});
