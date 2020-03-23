var shell = require("shelljs");

shell.echo("install frontend main-app");
shell.cd("./frontend/main-app");
shell.exec("yarn install");
shell.cd("..");
shell.cd("..");
