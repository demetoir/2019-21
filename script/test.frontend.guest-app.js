const shell = require("shelljs");

// test front guest-app
shell.echo("test front guest-app");
shell.cd("./frontend/guest-app");
code = shell.exec("yarn test a --watchAll=false").code;
if (code !== 0) {
  shell.exit(code);
}
shell.cd("..");
shell.cd("..");
