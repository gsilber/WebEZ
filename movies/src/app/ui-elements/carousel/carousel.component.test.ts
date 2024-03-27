import { describe, expect, test, beforeAll } from "@jest/globals";
import { CarouselComponent } from "./carousel.component";
import { bootstrap } from "@gsilber/webez";
import { MainComponent } from "../../main.component";

describe("CarouselComponent", () => {
    let component: any = undefined;
    let parent: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        parent = bootstrap<MainComponent>(MainComponent, html);
        component = new CarouselComponent(10, []);
        parent.addComponent(component);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(CarouselComponent);
        });
    });
});
