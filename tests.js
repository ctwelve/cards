// Babel and sourcemap all at once
require("@babel/register");

const Jasmine = require("jasmine");

const tests = new Jasmine();
tests.loadConfig({
	spec_dir: "./build",
	spec_files: ["**/*.test.js"],
});

tests.execute();
