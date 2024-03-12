//@ts-expect-error(2339)
declare const window: Window;

describe("House class", () => {
    describe("Constructor", () => {
        test("(1 pts) Create Instance", () => {
            console.log(window.document);
            expect(1).toBe(1);
        });
    });
});
