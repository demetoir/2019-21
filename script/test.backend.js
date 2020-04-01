const shell = require("shelljs");

let code;
// backend test
shell.echo("test backend");
shell.cd("./backend");
shell.exec("cp .env.example .env");
code = shell.exec("yarn test").code;
if (code !== 0) {
	shell.exit(code);
}
shell.cd("..");
