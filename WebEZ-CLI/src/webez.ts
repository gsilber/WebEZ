#!/usr/bin/env node
const version: string = '0.1.3';

import fs from "fs";
import path from "path";

function usage() {
    console.error("Usage: webez <command> <name>");
    console.error("\tWhere command is one of [new, component]");
    console.error("\tand name is the name of the app or component to create");
    console.error("\tExample: webez new myapp");
    console.error("\tExample: webez component mycomponent");
}

function findWebezConfigFile(directoryPath: string): boolean {
    let currentPath = directoryPath;
    while (currentPath !== "/") {
        const configFile = path.join(currentPath, ".webez.json");
        if (fs.existsSync(configFile)) {
            return true;
        }
        currentPath = path.dirname(currentPath);
    }
    return false;
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
    childProcess.execSync("mv gitignore .gitignore");
    console.log("Dependencies installed");
    console.log("Done");
}
function createComponent(componentName: string) {
    if (
        componentName.endsWith("Component") ||
        componentName.endsWith("component")
    ) {
        componentName = componentName.substring(0, componentName.length - 9);
    }
    if (componentName.endsWith("-")) {
        componentName = componentName.substring(0, componentName.length - 1);
    }
    console.log("Creating a new component: " + componentName);
    if (fs.existsSync(componentName))
        throw new Error("Directory already exists: " + componentName);
    // Create the component directory
    fs.mkdirSync(componentName);
    // Read the scaffold directory
    console.log("Copying scaffold files");
    const scaffoldDir = path.join(__dirname, "component-scaffold");
    const files = fs.readdirSync(scaffoldDir);
    // Iterate through each file in the scaffold directory
    files.forEach((file) => {
        const srcPath = path.join(scaffoldDir, file);
        const destPath = path.join(
            componentName,
            file.replace(/template/, componentName)
        );
        const stats = fs.statSync(srcPath);
        if (stats.isDirectory()) {
            // If it's a directory, do nothing
        } else {
            // If it's a file, read the file content
            let fileContent = fs.readFileSync(srcPath, "utf-8");
            // Replace ######## with the component name
            fileContent = fileContent.replace(/########/g, componentName);
            // Replace $$$$$$$$ with the camel case of the component name
            const camelCaseName = toCamelCase(componentName);
            fileContent = fileContent.replace(
                /\$\$\$\$\$\$\$\$/g,
                camelCaseName
            );
            // Write the modified file content to the destination path
            fs.writeFileSync(destPath, fileContent, "utf-8");
        }
    });
    console.log("Component scaffold created");
}

function toCamelCase(name: string) {
    // Convert the name to camel case
    // Implementation of converting name to camel case
    const camelCaseName = name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
    return camelCaseName;
}

function runProgram() {
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
            if (findWebezConfigFile(path.dirname(process.cwd())))
                createComponent(process.argv[3]);
            else
                console.error(
                    "This command is only valid within a webez application created with webez new <appname>"
                );
        }
    } catch (e: any) {
        console.log("Error: " + e.message);
    }
}
console.log(`webez v.${version} is starting...`);
runProgram();
console.log("Finished");
