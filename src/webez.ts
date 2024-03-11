#!/usr/bin/env node

import * as path from "path";
import * as fs from "fs";

interface FileDescriptor {
    fileName: string;
    content: string;
}
const rootfiles: FileDescriptor[] = [
    {
        fileName: "package.json",
        content: `{
  "name": "########",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build:dev": "webpack --mode development",
    "build:prod": "webpack --mode production",
    "start": "webpack serve"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@gsilber/webez": "^0.0.7",
    "@types/guid": "^1.0.3",
    "@types/node": "^20.11.25",
    "bootstrap": "^5.3.3",
    "clean-webpack-plugin": "^4.0.0",
    "css-loader": "^6.10.0",
    "fs": "^0.0.1-security",
    "guid": "^0.0.12",
    "html-webpack-plugin": "^5.6.0",
    "raw-loader": "^4.0.2",
    "reflect-metadata": "^0.2.1",
    "style-loader": "^3.3.4",
    "ts-loader": "^9.5.1",
    "ts-node": "^10.9.2",
    "webpack": "^5.90.3",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^5.0.2"
  }
  }`,
    },
    {
        fileName: "webpack.config.js",
        content: `
  const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const css = require("css-loader");

module.exports = {
    mode: "development",
    devServer: {
        historyApiFallback: true,
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },

    module: {
        rules: [
            {
                test: /\.html$/i,
                use:[{
                    loader: 'raw-loader',
                    options: {
                        esModule: false,
                    }
                }]
                
              },
			// TypeScript
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
			// CSS
			{
                test: /src\/.+\.css$/i,
                use: [ "css-loader"],
            },            
			{
                test: /^((?!src\/).)*.css$/i,
                use: ["style-loader", "css-loader"],
            },            
			// Images
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: "asset/resource",
            },
            // Fonts and SVGs
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: "asset/inline",
            },
        ],
    },
    entry: {
        main: path.resolve(__dirname, "./wbcore/start.ts"),
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].bundle.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "webpack Boilerplate",
            template: path.resolve(__dirname, "./src/index.html"), // template file
            filename: "index.html", // output file
        }),
        new CleanWebpackPlugin(),
    ],
};
  `,
    },
    {
        fileName: "tsconfig.json",
        content: `{
  "compilerOptions": {
    "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    "experimentalDecorators": true,                   /* Enable experimental support for legacy experimental decorators. */
    "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    "module": "commonjs",                                /* Specify what module code is generated. */
    "rootDir": ".",                                  /* Specify the root folder within your source files. */
    "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
    "outDir": "./dist",                                   /* Specify an output folder for all emitted files. */
    "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */
    "strict": true,                                      /* Enable all strict type-checking options. */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  },
  "include": [
    "./src/**/*"
  ]
}`,
    },
    {
        fileName: "settings.json",
        content: `{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "editor.formatOnSave": true,
    "editor.formatOnPaste": true
}`,
    },
    { fileName: "styles.css", content: `/* Put your styles here */` },
    { fileName: "README.md", content: `# ########` },
    {
        fileName: "settings.json",
        content: `{
    "recommendations": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode"
    ]
}`,
    },
    {
        fileName: "extensions.json",
        content: `{
    "recommendations": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode"
    ]
}`,
    },
    {
        fileName: ".prettierrc",
        content: `{
    "experimentalTernaries": true,
    "tabWidth": 4
}
`,
    },
    {
        fileName: ".gitignore",
        content: `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/
dist/
dest/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
# Comment in the public line in if your project uses Gatsby and not Next.js
# https://nextjs.org/blog/next-9-1#public-directory-support
# public

# vuepress build output
.vuepress/dist

# vuepress v2.x temp and cache directory
.temp
.cache

# Docusaurus cache and generated files
.docusaurus

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

package-lock.json
# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*
`,
    },
    {
        fileName: ".gitattributes",
        content: `        # .gitattributes snippet to force users to use same line endings for project.
        # 
        # Handle line endings automatically for files detected as text
        # and leave all files detected as binary untouched.
        * text=auto

        #
        # The above will handle all files NOT found below
        # https://help.github.com/articles/dealing-with-line-endings/
        # https://github.com/Danimoth/gitattributes/blob/master/Web.gitattributes



        # These files are text and should be normalized (Convert crlf => lf)
        *.php text
        *.css text
        *.js text
        *.json text
        *.htm text
        *.html text
        *.xml text
        *.txt text
        *.ini text
        *.inc text
        *.pl text
        *.rb text
        *.py text
        *.scm text
        *.sql text
        .htaccess text
        *.sh text
        *.svg text

        # These files are binary and should be left untouched
        # (binary is a macro for -text -diff)
        *.png binary
        *.jpg binary
        *.jpeg binary
        *.gif binary
        *.ico binary
        *.mov binary
        *.mp4 binary
        *.mp3 binary
        *.flv binary
        *.fla binary
        *.swf binary
        *.gz binary
        *.zip binary
        *.7z binary
        *.ttf binary
        *.pyc binary`,
    },
    {
        fileName: ".eslintrc.js",
        content: `module.exports = {
    env: {
        es2022: true,
        node: true,
    },
    extends: ["eslint:recommended"],
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    overrides: [
        {
            files: ["test/**/*"],
            env: {
                jest: true,
            },
        },
    ],
    parserOptions: {
        project: ["./tsconfig.json"],
    },
    ignorePatterns: [".eslintrc.js"],
    rules: {
        // https://stackoverflow.com/questions/57802057/eslint-configuring-no-unused-vars-for-typescript
        // Use typescript's checker for unused vars (critical for Enums)
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"],
        // https://typescript-eslint.io/rules/no-use-before-define
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": "error",

        // https://typescript-eslint.io/rules/ban-ts-comment
        // Disallow @ts-<directive> comments or require descriptions after directives.
        "@typescript-eslint/ban-ts-comment": "error",

        // https://typescript-eslint.io/rules/no-explicit-any
        // Disallow the any type.
        //"@typescript-eslint/no-explicit-any": "error",

        // https://typescript-eslint.io/rules/no-unsafe-assignment
        // Disallow assigning a value with type any to variables and properties.
        "@typescript-eslint/no-unsafe-assignment": "error",

        // https://typescript-eslint.io/rules/no-unsafe-return
        // Disallow returning a value with type any from a function.
        "@typescript-eslint/no-unsafe-return": "error",

        // https://typescript-eslint.io/rules/ban-types
        // Disallow certain types.
        "@typescript-eslint/ban-types": [
            "error",
            {
                types: {
                    unknown: "That is not allowed in this course.",
                    any: "That is not allowed in this course.",
                },
            },
        ],
        // https://typescript-eslint.io/rules/no-array-constructor
        // Disallow generic Array constructors.
        "no-array-constructor": "off",
        "@typescript-eslint/no-array-constructor": "error",

        // https://typescript-eslint.io/rules/no-base-to-string
        // Require .toString() to only be called on objects which provide useful information when stringified.
        "@typescript-eslint/no-base-to-string": "error",

        // https://typescript-eslint.io/rules/no-confusing-void-expression
        // Require expressions of type void to appear in statement position.
        "@typescript-eslint/no-confusing-void-expression": "error",

        // https://typescript-eslint.io/rules/no-for-in-array
        // Disallow iterating over an array with a for-in loop. (Force for-of instead!)
        "@typescript-eslint/no-for-in-array": "error",

        // https://typescript-eslint.io/rules/no-unnecessary-boolean-literal-compare
        // Disallow unnecessary equality comparisons against boolean literals.
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",

        // https://typescript-eslint.io/rules/no-unnecessary-condition
        // Disallow conditionals where the type is always truthy or always falsy.
        "@typescript-eslint/no-unnecessary-condition": "error",
    },
};`,
    },
];

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
