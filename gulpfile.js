const path = require("path");
const gulp = require("gulp");
const rimraf = require("rimraf");

const child_process = require("child_process");
const $ = require("gulp-load-plugins")();

gulp.task("server:clean", (cb) => {
	rimraf("./build").then(() => cb());
});

gulp.task("server:build", gulp.series("server:clean", compileServer));

gulp.task("server:watch", gulp.series("server:build", watchServer));

gulp.task(
	"server:dev",
	gulp.series("server:build", gulp.parallel(watchServer, runServer))
);

gulp.task("server:test", gulp.series("server:build", testServer));

gulp.task(
	"server:test:dev",
	gulp.series("server:build", gulp.parallel(watchServer, runServerTests))
);

function compileServer() {
	return gulp
		.src("./src/server/**/*.js")
		.pipe($.changed("./build"))
		.pipe($.sourcemaps.init())
		.pipe($.babel())
		.pipe(
			$.sourcemaps.write(".", {
				sourceRoot: path.join(__dirname, "src", "server")
			})
		)
		.pipe(gulp.dest("./build"))
		.on("error", () => {});
}

function runServer() {
	return $.nodemon({
		script: "./server.js",
		watch: "build",
		ignore: ["**/*.test.js"]
	});
}

function watchServer() {
	return gulp
		.watch("./src/server/**/*.js", gulp.series(compileServer))
		.on("error", () => {});
}

function testServer(cb) {
	child_process.exec("node ./tests.js", (err, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);

		if (err) {
			cb(new $.util.PluginError("testServer", "tests failed"));
		} else {
			cb();
		}
	});
}

function runServerTests() {
	return $.nodemon({
		script: "./tests.js",
		watch: "build"
	});
}
