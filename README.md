# WebEZ
## Documentation
WebEZ is a super simple framework for TS and html.  Designed to be used with webpack, you can install this with

### Installation
```
npm install --save @gsilber/webez
```
Once installed, you overload the WebPage class, and implement the onLoad method.  Then instantiate an object of your new type.

### Typescript
```
import { WebPage } from "@gsilber/webez";
export class IndexPage extends WebPage {
	protected onLoad(): void {
		let rootElement = this.getElement("root");
		if (rootElement){
		rootElement.setHtml("<h1>HO HO HO!</h1>");
		rootElement.click=this.onClick;
		}
		
	}
	onClick(event: Event): void {
		console.log(event);

	}
}
let page:IndexPage = new IndexPage();
```

### HTML
Here is the sample html page that goes with this:
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Test Page</title>
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
```

