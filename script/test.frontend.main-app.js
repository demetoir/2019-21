const shell = require("shelljs");

// test front main-app
shell.echo("test front main-app");
shell.cd("./frontend/main-app");
code = shell.exec("yarn test a --watchAll=false").code;
if (code !== 0) {
  shell.exit(code);
}
shell.cd("..");
shell.cd("..");
