import '../styles.css';

import { MainComponent } from '../src/app/main.component';

const mainComponent=new MainComponent();
const target=document.getElementById("main-target")
if (target)
	mainComponent.appendToDomElement(target);
else
	mainComponent.appendToDomElement(document.body);

