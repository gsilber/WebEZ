import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { bootstrap } from "../../bootstrap";
import { TestComponent } from "../testing_components/test.component";
import { EzComponent, HttpMethod } from "../../EzComponent";
import mock from "xhr-mock";

describe("Ajax Testing", () => {
    describe("Test bad target", () => {
        beforeEach(() => {
            mock.setup();
        });

        // put the real XHR object back and clear the mocks after each test
        afterEach(() => {
            mock.teardown();
        });
        test("Create Instance", async () => {
            mock.get("/api/good", (req, res) => {
                expect(req.header("Content-Type")).toEqual("application/json");
                return res.status(200).body('{"data":{"id":"abc-123"}}');
            });
            let toplevel: EzComponent = bootstrap<TestComponent>(TestComponent);
            try {
                await toplevel["ajax"]<any>("/api/bad", HttpMethod.GET, [
                    { "content-type": "application/json" },
                ]).toPromise();
                //make sure this doesn't happen
                expect(true).toBe(false);
            } catch (e) {
                expect(e).toBeInstanceOf(Error);
            }
        });
    });
    describe("Test bad target no headers", () => {
        test("Create Instance", async () => {
            mock.get("/api/good", (req, res) => {
                return res.status(200).body('{"data":{"id":"abc-123"}}');
            });
            let toplevel: EzComponent = bootstrap<TestComponent>(TestComponent);
            try {
                await toplevel["ajax"]<any>(
                    "/api/bad",
                    HttpMethod.GET,
                ).toPromise();
                //make sure this doesn't happen
                expect(true).toBe(false);
            } catch (e) {
                expect(e).toBeInstanceOf(Error);
            }
        });
    });
    describe("Test good target no error", () => {
        test("Create Instance", async () => {});
    });
});
