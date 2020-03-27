const shell = require("shelljs");

shell.echo("build backend");
shell.cd("./backend");

shell.echo("install package");
shell.exec("yarn install");

shell.echo("clean build");
shell.exec("yarn build:clean");

shell.echo("babel compile");
shell.exec("yarn build");

// const isIncludeDotEnv = shell.test("-f", "./build/.env");
// if (!isIncludeDotEnv) {
//   shell.echo("build not include .env ");
//   shell.exit(1);
// }

shell.cd("..");
