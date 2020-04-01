var shell = require("shelljs");

shell.echo("install backend");
shell.cd("./backend");
shell.exec("yarn install");
shell.cd("..");
