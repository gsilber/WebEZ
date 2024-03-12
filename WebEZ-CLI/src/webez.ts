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

function copyDirectory(src: string, dest: string, appName: string) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }

    const files = fs.readdirSync(src);

    files.forEach((file) => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);

        const stats = fs.statSync(srcPath);

        if (stats.isDirectory()) {
            copyDirectory(srcPath, destPath, appName);
        } else {
            let fileContent = fs.readFileSync(srcPath, "utf-8");
            fileContent = fileContent.replace(/########/g, appName);
            fs.writeFileSync(destPath, fileContent, "utf-8");
        }
    });
}

function newApp(appName: string) {
    console.log("Creating a new app: " + appName);
    if (fs.existsSync(appName))
        throw new Error("Directory already exists: " + appName);
    //scaffold the directory
    //copy the scaffold files
    console.log("Copying scaffold files");
    const scaffoldDir = path.join(__dirname, "scaffold");
    copyDirectory(scaffoldDir, appName, appName);
    console.log("Scaffold files copied");
    //cd into directory
    process.chdir(appName);
    //call npm i
    console.log("Installing dependencies");
    const childProcess = require("child_process");
    childProcess.execSync("npm i");
    console.log("Dependencies installed");
    console.log("Done");
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
    console.log(e);
}
