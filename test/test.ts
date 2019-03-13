import {expect} from "chai";
import {OnlineValidator} from "../licenseio";

// const license = require('./licenseio')
//
// const validator = license.onlineValidator({
//     app_id: 'abvdef'
//
// });
//
// validator.validateByKey('mykey')
//     .then((license) => {
//         console.log("License validated");
//     }, (err) => {
//         console.log("An error happened " + err);
//     })

describe("OnlineValidator", () => {
    describe("constructor", () => {
        it("should sets appId and baseUrl", () => {
            const validator = new OnlineValidator("my-app-id", "http://mybaseurl/");
            expect(validator.appId).to.equal("my-app-id");
            expect(validator.baseUrl).to.equal("http://mybaseurl/");
        });

        it("should default baseUrl when not given", () => {
            const validator = new OnlineValidator("my-app-id");
            expect(validator.appId).to.equal("my-app-id");
            expect(validator.baseUrl).to.equal("https://api.license.io");
        });
    });

    describe("validateByKey", () => {
        let validator: OnlineValidator;

        before(() => {
            validator = new OnlineValidator("3ccf0f1b-dd3f-48d9-911a-ddf479078c37", "http://localhost:8000");
        });

        it("should resolve successfully", async () => {
            const result = await validator.validateByKey("demoli-censek-ey");
        });

    });

});

