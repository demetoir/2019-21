const shell = require("shelljs");

// test front host-app
shell.echo("test front host-app");
shell.cd("./frontend/host-app");
code = shell.exec("yarn test a --watchAll=false").code;
if (code !== 0) {
  shell.exit(code);
}
shell.cd("..");
shell.cd("..");
