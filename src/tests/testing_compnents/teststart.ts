import { TestModuleRoot } from "./testModuleRoot";

export declare const window: Window;

const indexHtml: string = `
<!DOCTYPE html>
<html>
	<head>
		<title>Test</title>
		<link rel="stylesheet" href="styles.css">
	</head>
	<body>
		<div id="main-target"></div>
		<script src="main.js"></script>
	</body>
</html>`;

export class TestStart {
    rootComponent = new TestModuleRoot();
    constructor(window: Window) {
        //give us a simple document like the cli creates
        window.document.body.innerHTML = indexHtml;
        const target = window.document.getElementById("main-target");
        if (target) this.rootComponent.appendToDomElement(target);
        else this.rootComponent.appendToDomElement(window.document.body);
    }
}
