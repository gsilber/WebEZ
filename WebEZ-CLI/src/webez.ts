#!/usr/bin/env node

import fs from "fs";
import path from "path";

function usage() {
    console.error("Usage: webez <command> <name>");
    console.error("\tWhere name is one of (new, component)");
    console.error("\tand name is the name of the app or component to create");
    console.error("\tExample: webez new myapp");
    console.error("\tExample: webez component mycomponent");
}

function newApp(appName: string) {
    console.log("Creating a new app: " + appName);
    if (fs.existsSync(appName))
        throw new Error("Directory already exists: " + appName);
    fs.mkdirSync(appName);
    fs.mkdirSync(path.join(appName, "src"));
    fs.mkdirSync(path.join(appName, "src", "app"));
    fs.mkdirSync(path.join(appName, "wbcore"));
    fs.mkdirSync(path.join(appName, ".vscode"));
    if (!fs.existsSync(appName))
        throw new Error("Error creating directory: " + appName);
    //scaffold the directory
    //cd into directory
    //call npm i
}
function newComponent(componentName: string) {
    console.log("Creating a new component: " + componentName);
}
// Provide a title to the process in `ps`.
// Due to an obscure Mac bug, do not start this title with any symbol.
try {
    process.title = "webez " + Array.from(process.argv).slice(2).join(" ");
} catch (_) {
    // If an error happened above, use the most basic title.
    process.title = "webez";
}

if (
    process.argv.length !== 4 ||
    !(process.argv[2].startsWith("n") || process.argv[2].startsWith("c"))
) {
    usage();
    process.exit(1);
}

try {
    if (process.argv[2].startsWith("n")) {
        newApp(process.argv[3]);
    } else {
        newComponent(process.argv[3]);
    }
    console.log("Finished");
} catch (e: any) {
    console.log("Error: " + e.message);
}
