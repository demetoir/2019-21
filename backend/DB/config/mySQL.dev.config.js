const path = require("path");

const envPath = path.resolve(__dirname, "../../.env");

require("dotenv").config({path: envPath});

const host = process.env.MYSQL_DEV_HOST;
const username = process.env.MYSQL_DEV_USER;
const password = process.env.MYSQL_DEV_PASSWORD;
const scheme = process.env.MYSQL_DEV_SCHEME;
const dialect = process.env.MYSQL_DEV_DIALECT;
const port = process.env.MYSQL_DEV_PORT;
const containerName = process.env.MYSQL_DEV_CONTAINER_NAME;
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
	logging,
	database: scheme,
};

export default config;
