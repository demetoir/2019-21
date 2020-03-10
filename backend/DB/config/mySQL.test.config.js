const path = require("path");

const envPath = path.resolve(__dirname, "../../.env");

require("dotenv").config({path: envPath});

const host = process.env.MYSQL_TEST_HOST;
const username = process.env.MYSQL_TEST_USER;
const password = process.env.MYSQL_TEST_PASSWORD;
const scheme = process.env.MYSQL_TEST_SCHEME;
const dialect = process.env.MYSQL_TEST_DIALECT;
const port = process.env.MYSQL_TEST_PORT;
const containerName = process.env.MYSQL_TEST_CONTAINER_NAME;
const storage = process.env.MYSQL_TEST_STORAGE;
const logging = false;

const pool = {
	max: 5,
	min: 0,
	acquire: 30000,
	idle: 10000,
};

const config = {
	host,
	username,
	password,
	scheme,
	dialect,
	port,
	pool,
	containerName,
	storage,
	logging,
	database: scheme,
};

export default config;
