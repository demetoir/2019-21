const shell = require("shelljs");

let code;
// backend test
shell.echo("test backend");
shell.cd("./backend");
shell.exec("cp .env.example .env");
code = shell.exec("yarn test").code;
if (code !== 0) {
  shell.exit(code);
  // console.log(code)
  // process.exit(code);
}
shell.cd("..");

// test front guest-app
shell.echo("test front guest-app");
shell.cd("./frontend/guest-app");
code = shell.exec("yarn test a --watchAll=false").code;
if (code !== 0) {
  shell.exit(code);
}
shell.cd("..");
shell.cd("..");

// test front host-app
shell.echo("test front host-app");
shell.cd("./frontend/host-app");
code = shell.exec("yarn test a --watchAll=false").code;
if (code !== 0) {
  shell.exit(code);
}
shell.cd("..");
shell.cd("..");

// test front main-app
shell.echo("test front main-app");
shell.cd("./frontend/main-app");
code = shell.exec("yarn test a --watchAll=false").code;
if (code !== 0) {
  shell.exit(code);
}
shell.cd("..");
shell.cd("..");
