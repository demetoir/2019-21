var shell = require("shelljs");

shell.echo("install frontend host-app");
shell.cd("./frontend/host-app");
shell.exec("yarn install");
shell.cd("..");
shell.cd("..");
