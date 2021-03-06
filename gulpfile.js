var browserify = require("browserify");
var connectLiveReload = require("connect-livereload");
var eventStream = require("event-stream");
var express = require("express");
var fs = require("fs");
var gulp = require("gulp");
var gulpJSDoc = require("gulp-jsdoc");
var gulpJSHint = require("gulp-jshint");
var gulpLiveReload = require("gulp-livereload");
var gulpMochaPhantomJS = require("gulp-mocha-phantomjs");
var gutil = require("gulp-util");
var nib = require("nib");
var nodeNotifier = require("node-notifier");
var path = require("path");
var runSequence = require("run-sequence");
var source = require("vinyl-source-stream");
var stylus = require("gulp-stylus");
var watchify = require("watchify");

var paths = {
  lib: {
    baseDir: "./lib",
    jsMain: "./lib/index.js",
    jsAll: "./lib/**/*.js",
    stylMain: "./lib/index.styl",
    stylAll: "./lib/**/*.styl"
  },
  test: {
    baseDir: "./test",
    htmlMain: "./test/index.html",
    htmlAll: "./test/**/*.html",
    jsMain: "./test/index.js",
    jsAll: "./test/**/*.js",
    stylMain: "./test/index.styl",
    stylAll: "./test/**/*.styl"
  },
  examples: {
    baseDir: "./examples",
    htmlMain: "index.html",
    htmlAll: "**/*.html",
    jsMain: "index.js",
    jsAll: "**/*.js",
    stylMain: "index.styl",
    stylAll: "**/*.styl"
  },
  dist: {
    baseDir: "./dist",
    testDir: "./dist/test",
    examplesDir: "./dist/examples",
    jsdocDir: "./dist/jsdoc"
  }
};

// Gets the 1st-level subdirectories of baseDir
function getSubDirs(baseDir) {
  return fs.readdirSync(baseDir)
    .filter(function(file) {
      return fs.statSync(path.join(baseDir, file)).isDirectory();
    });
}

// Maps a callback for every subdirectory of baseDir
function mapSubDir(baseDir, callback) {
  return getSubDirs(baseDir).map(callback);
}

// Runs a callback for every subdirectory of baseDir
function forEachSubDir(baseDir, callback) {
  getSubDirs(baseDir).forEach(callback);
}

// Maps a create stream function over each subdirectory, and returns a concatenation
// of the streams
function concatSubDirStreams(baseDir, createStream) {
  var streams = mapSubDir(baseDir, createStream);
  return eventStream.concat.apply(null, streams);
}

// Shows a Mac OSX notification with the given message
function notify(message) {
  nodeNotifier.notify({
    title: "gulp - decks",
    message: message
  });
}

function runJSHint(sourcePath) {
  return gulp.src(sourcePath)
    .pipe(gulpJSHint())
    .pipe(gulpJSHint.reporter("jshint-stylish"))
    .pipe(gulpJSHint.reporter("fail"));
}

// Helper function to execute the phantom tests
function runPhantomTests() {
  var isFailed = false;
  return gulp.src(path.join(paths.dist.testDir, "index.html"))
    .pipe(gulpMochaPhantomJS())
    .on("error", function() {
      isFailed = true;
      notify("Tests failed!");
    })
    .on("end", function() {
      if (!isFailed) {
        notify("Tests passed!");
      }
    });
}

////////////////////////////////////////////////////////////////////////////////
// lib tasks
////////////////////////////////////////////////////////////////////////////////

// TODO: need more tasks here

gulp.task("styl-lib", function() {
  gulp.src(paths.lib.stylMain)
    .pipe(stylus({ use: nib() }))
    .pipe(gulp.dest(paths.dist.baseDir));
});

gulp.task("lib-jshint", function() {
  return runJSHint(paths.lib.jsAll);
});

gulp.task("jsdoc-lib", function() {
  return gulp.src([paths.lib.jsAll, "README.md"])
    .pipe(gulpJSDoc(paths.dist.jsdocDir));
});

gulp.task("lib", ["styl-lib", "lib-jshint", "jsdoc-lib"]);

gulp.task("watch-lib", ["lib"], function() {
  gulp.watch(paths.lib.stylAll, ["styl-lib"]);
  gulp.watch(paths.lib.jsAll, ["lib-jshint", "jsdoc-lib"]);
});

////////////////////////////////////////////////////////////////////////////////
// example tasks
////////////////////////////////////////////////////////////////////////////////

gulp.task("html-examples", function() {
  return concatSubDirStreams(paths.examples.baseDir, function(dir) {
    return gulp.src(path.join(paths.examples.baseDir, dir, paths.examples.htmlMain))
      .pipe(gulp.dest(path.join(paths.dist.examplesDir, dir)));
  });
});

gulp.task("styl-examples", function() {
  return concatSubDirStreams(paths.examples.baseDir, function(dir) {
    return gulp.src(path.join(paths.examples.baseDir, dir, paths.examples.stylMain))
      .pipe(stylus({ use: nib() }))
      .pipe(gulp.dest(path.join(paths.dist.examplesDir, dir)));
  });
});

gulp.task("examples-jshint", function() {
  return concatSubDirStreams(paths.examples.baseDir, function(dir) {
    return runJSHint(
      path.join(paths.examples.baseDir, dir, paths.examples.jsAll)
    );
  });
});

gulp.task("js-examples", function() {
  return concatSubDirStreams(paths.examples.baseDir, function(dir) {
    var indexjsPath = "./" + path.join(paths.examples.baseDir, dir, paths.examples.jsMain);

    var bundler = browserify(indexjsPath, {
      noparse: ['lodash', 'q'],
      debug: true
    });

    bundler.transform('jadeify')

    return bundler.bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(path.join(paths.dist.examplesDir, dir)));
  });
});

gulp.task("examples", ["html-examples", "styl-examples", "examples-jshint", "js-examples"]);

gulp.task('watch-examples', ['examples'], function () {
  var liveReload = gulpLiveReload();

  gulp.watch(path.join(paths.examples.baseDir, paths.examples.htmlAll), ['html-examples']);

  gulp.watch(path.join(paths.examples.baseDir, paths.examples.stylAll), ['styl-examples']);

  gulp.watch(paths.dist.baseDir + '/**/*').on('change', function (file) {
    liveReload.changed(file.path);
  });

  forEachSubDir(paths.examples.baseDir, function(dir) {
    var indexjsPath = "./" + path.join(paths.examples.baseDir, dir, paths.examples.jsMain);

    var bundler = watchify(browserify(indexjsPath, {
      cache: {},
      packageCache: {},
      fullPaths: true,
      debug: true
    }));

    bundler.transform('jadeify')

    bundler.on("update", rebundle);

    function rebundle() {
      return bundler.bundle()
        .on("error", gutil.log.bind(gutil, "browserify error"))
        .pipe(source("bundle.js"))
        .pipe(gulp.dest(path.join(paths.dist.examplesDir, dir)))
        .on('end', gutil.log.bind(gutil, "finished bundling"));
    }
  });
});

////////////////////////////////////////////////////////////////////////////////
// test tasks
////////////////////////////////////////////////////////////////////////////////

gulp.task("html-test", function() {
  gulp.src(paths.test.htmlMain)
    .pipe(gulp.dest(paths.dist.testDir));
});

gulp.task("styl-test", function() {
  gulp.src(paths.test.stylMain)
    .pipe(stylus({ use: nib() }))
    .pipe(gulp.dest(paths.dist.testDir));
});

gulp.task("test-jshint", function() {
  return runJSHint(paths.test.jsAll);
});

gulp.task("js-test", function() {
  return browserify(paths.test.jsMain)
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest(paths.dist.testDir));
});

gulp.task("test", ["html-test", "styl-test", "test-jshint", "js-test"], function() {
  return runPhantomTests();
});

gulp.task("watch-test", ["test"], function() {
  gulp.watch(paths.test.htmlAll, ["html-test"]);

  gulp.watch(paths.test.stylAll, ["styl-test"]);

  gulp.watch(paths.test.jsAll, ["test-jshint"]);

  var bundler = watchify(browserify(paths.test.jsMain, watchify.args));

  bundler.on("update", rebundle);

  function rebundle() {
    return bundler.bundle()
      .on("error", gutil.log.bind(gutil, "browserify error"))
      .pipe(source("bundle.js"))
      .pipe(gulp.dest(paths.dist.testDir));
  }

  gulp.watch(path.join(paths.dist.testDir, "bundle.js"), ["test"]);
});

////////////////////////////////////////////////////////////////////////////////
// Live reload server
////////////////////////////////////////////////////////////////////////////////

gulp.task("serve", function() {
  var app = express();
  app.use(connectLiveReload());
  app.use(express.static(path.join(__dirname, paths.dist.baseDir)));
  app.listen(3000);
});

////////////////////////////////////////////////////////////////////////////////
// Default task
////////////////////////////////////////////////////////////////////////////////

gulp.task("default", function(cb) {
  return runSequence(
    ["watch-test", "watch-examples", "watch-lib"],
    "serve",
    cb
  );
});
