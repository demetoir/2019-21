var shell = require("shelljs");

shell.cd("./backend");
shell.exec("yarn install");
shell.cd("..");

shell.cd("./frontend/guest-app");
shell.exec("yarn install");
shell.cd("..");
shell.cd("..");

shell.cd("./frontend/host-app");
shell.exec("yarn install");
shell.cd("..");
shell.cd("..");

shell.cd("./frontend/main-app");
shell.exec("yarn install");
shell.cd("..");
shell.cd("..");

//
// // Run external tool synchronously
// if (shell.exec('git commit -am "Auto-commit"').code !== 0) {
// 	shell.echo('Error: Git commit failed');
// 	shell.exit(1);
// }
