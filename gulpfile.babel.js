const gulp = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const fileinclude = require("gulp-file-include");
const htmlbeautify = require("gulp-html-beautify");
const ejs = require("gulp-ejs");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const ghPages = require("gulp-gh-pages");
const del = require("del");

const SRC_FOLDER = "./src";
const DIST_FOLDER = "./dist";

const SRC_PATH = {
    ASSETS: {
        FONTS: "./src/assets/fonts",
        IMAGES: "./src/assets/images",
        SCSS: "./src/assets/scss",
        JS: "./src/assets/js",
        MOVIES: "./src/assets/movies",
    },
    EJS: "./src/ejs",
  },
  DEST_PATH = {
    ASSETS: {
        FONTS: "./dist/assets/fonts",
        IMAGES: "./dist/assets/images",
        CSS: "./dist/assets/css",
        JS: "./dist/assets/js",
        MOVIES: "./dist/assets/movies",
    },
  },
  // 옵션
  OPTIONS = {
    outputStyle: "expanded",
    indentType: "space",
    indentWidth: 4,
    precision: 8,
  };

gulp.task("clean", function () {
  return del(["dist"]);
});

gulp.task("html", () => {
  return gulp
    .src([SRC_FOLDER + "**/*.html"], {
      base: SRC_FOLDER,
      since: gulp.lastRun("html"),
    })
    .pipe(gulp.dest(DIST_FOLDER))
    .pipe(browserSync.stream());
});

gulp.task("ejs", function () {
  return gulp
    .src([SRC_PATH.EJS + "/**/!(_)*.ejs", SRC_PATH.EJS + "/*.ejs"])
    .pipe(ejs({
      DOCUMENT_ROOT: '/'  // 로컬 환경에서는 기본적으로 / 사용
    }))
    .pipe(rename({ extname: ".html" }))
    .pipe(
      fileinclude({
        prefix: "@@", // 사용할 때 @@ 붙이면 됨
        basepath: "@file",
      })
    )
    .pipe(htmlbeautify({ indentSize: 2 }))
    .pipe(gulp.dest(DIST_FOLDER))
    .pipe(browserSync.stream());
});

gulp.task("ejs-prod", function () {
  return gulp
    .src([SRC_PATH.EJS + "/**/!(_)*.ejs", SRC_PATH.EJS + "/*.ejs"])
    .pipe(ejs({
      DOCUMENT_ROOT: '/unionnews/'  // 배포 환경에서는 /unionnews/ 사용
    }))
    .pipe(rename({ extname: ".html" }))
    .pipe(
      fileinclude({
        prefix: "@@", // 사용할 때 @@ 붙이면 됨
        basepath: "@file",
      })
    )
    .pipe(htmlbeautify({ indentSize: 2 }))
    .pipe(gulp.dest(DIST_FOLDER))
    .pipe(browserSync.stream());
});

gulp.task("scss:compile", function () {
  return gulp
    .src(SRC_PATH.ASSETS.SCSS + "/*.scss")
    .pipe(sourcemaps.init())
    .pipe(scss(OPTIONS).on('error', scss.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DEST_PATH.ASSETS.CSS))
    .pipe(browserSync.stream());
});

gulp.task("js", () => {
  return gulp
    .src([
      SRC_PATH.ASSETS.JS + "/**/*.js",
    ])
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(DEST_PATH.ASSETS.JS))
    .pipe(browserSync.stream());
});

gulp.task("images", () => {
  return gulp
    .src(SRC_PATH.ASSETS.IMAGES + "/**/*.+(png|jpg|jpeg|gif|ico)")
    .pipe(gulp.dest(DEST_PATH.ASSETS.IMAGES))
    .pipe(browserSync.stream());
});

gulp.task("svg", () => {
  return gulp
    .src(SRC_PATH.ASSETS.IMAGES + "/**/*.svg")
    .pipe(gulp.dest(DEST_PATH.ASSETS.IMAGES))
    .pipe(browserSync.stream());
});

gulp.task("fonts", () => {
  return gulp
    .src(SRC_PATH.ASSETS.FONTS + "/**/*.+(eot|otf|svg|ttf|woff|woff2)")
    .pipe(gulp.dest(DEST_PATH.ASSETS.FONTS))
    .pipe(browserSync.stream());
});

gulp.task("movies", () => {
  return gulp
    .src(SRC_PATH.ASSETS.MOVIES + "/*")
    .pipe(gulp.dest(DEST_PATH.ASSETS.MOVIES))
    .pipe(browserSync.stream());
});

gulp.task("watch", function () {
  gulp.watch(SRC_PATH.EJS + "/**/*.ejs", gulp.series("ejs"));
  gulp.watch(SRC_PATH.ASSETS.SCSS + "/**/*.scss", gulp.series("scss:compile"));
  gulp.watch(SRC_PATH.ASSETS.JS + "/**/*.js", gulp.series("js"));
  gulp.watch(SRC_PATH.ASSETS.IMAGES + "/**/*.+(png|jpg|jpeg|gif|ico)", gulp.series("images"));
  gulp.watch(SRC_PATH.ASSETS.IMAGES + "/**/*.svg", gulp.series("svg"));
  gulp.watch(SRC_PATH.ASSETS.FONTS + "/**/*.+(eot|otf|svg|ttf|woff|woff2)", gulp.series("fonts"));
  gulp.watch(SRC_PATH.ASSETS.MOVIES + "/*", gulp.series("movies"));
});

gulp.task("browserSync", function () {
    browserSync.init({
        notify: false,
        port: 9000,
        server: {
            baseDir: ["dist"],
            open: true,
        },
    });
});

function clean() {
    return del([DIST_FOLDER]);
}

gulp.task('gh', function () {
    return gulp.src(DIST_FOLDER + '/**/*')
    .pipe(ghPages());
});

gulp.task('cleanDeploy', function () {
    return del([".publish"]);
});

const prepare = gulp.series(clean);

const build = gulp.series(
    prepare,
    gulp.parallel("html", "ejs", "scss:compile", "js", "images", "svg", "fonts", "movies")
);

function watchFiles() {
    gulp.watch(SRC_PATH.EJS + "/**/*.ejs", gulp.series("ejs"));
    gulp.watch(SRC_PATH.ASSETS.SCSS + "/**/*.scss", gulp.series("scss:compile"));
    gulp.watch(SRC_PATH.ASSETS.JS + "/**/*.js", gulp.series("js"));
    gulp.watch(SRC_PATH.ASSETS.IMAGES + "/**/*.+(png|jpg|jpeg|gif|ico)", gulp.series("images"));
    gulp.watch(SRC_PATH.ASSETS.IMAGES + "/**/*.svg", gulp.series("svg"));
    gulp.watch(SRC_PATH.ASSETS.FONTS + "/**/*.+(eot|otf|svg|ttf|woff|woff2)", gulp.series("fonts"));
    gulp.watch(SRC_PATH.ASSETS.MOVIES + "/*", gulp.series("movies"));
}

const defaultTask = gulp.series(clean, build, gulp.parallel("browserSync", watchFiles));

const dev = gulp.series(build, gulp.parallel("browserSync", watchFiles));

const deploy = gulp.series('ejs-prod', 'gh', 'cleanDeploy');

module.exports = {
  clean,
  prepare,
  build,
  watch: watchFiles,
  default: defaultTask,
  dev,
  deploy
};