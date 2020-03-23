var shell = require("shelljs");

shell.echo("install frontend guest-app");
shell.cd("./frontend/guest-app");
shell.exec("yarn install");
shell.cd("..");
shell.cd("..");
