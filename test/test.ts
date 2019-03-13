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

describe("OnlineValidator constructor", () => {

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
