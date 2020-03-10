const devConfig = require("./config/mySQL.dev.config.js").default;
const testConfig = require("./config/mySQL.test.config.js").default;
const productConfig = require("./config/mySQL.prod.config.js").default;

module.exports = {
	development: devConfig,
	test: testConfig,
	production: productConfig,
};
