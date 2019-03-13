import {expect} from "chai";
import nock from "nock";
import {InvalidLicenseError, LicenseStatus, OnlineValidator} from "../src/licenseio";

const validLicenseResponse = {
    status: "active",
    licensee: {name: "Steven Van Bael", email: "steven@quantus.io", company: "Quantus BVBA"},
    application: {id: "3ccf0f1b-dd3f-48d9-911a-ddf479078c37", name: "Quantus Tasks"},
    name: "simple license",
    starts_at: "2019-03-13T15:03:53.846251Z",
    expiration_type: "date",
    expires_at: "2024-12-31T23:00:00Z",
    features: [],
    parameters: {},
    version: {min: {code: 0, name: "1.0.0"}, max: {code: 1000, name: "2.0.0"}},
    license_key: "demolicensekey",
    created_at: "2019-03-13T15:03:53.846251Z",
    updated_at: "2019-03-13T15:03:53.846251Z",
    id: "2419eff9-8212-4a09-bf00-c67f789d09d9",
};

const licenseKeyNotFoundResponse = {
    type: "invalid_request_error",
    message: "License with license_key 'not-existing-key' does not exist",
};

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
            validator = new OnlineValidator("3ccf0f1b-dd3f-48d9-911a-ddf479078c37");
        });

        it("should return valid License promise", async () => {
            nock("https://api.license.io")
                .post("/apps/v1/validate/key")
                .reply(200, validLicenseResponse);

            const license = await validator.validateByKey("demoli-censek-ey");
            expect(license.id).to.equal("2419eff9-8212-4a09-bf00-c67f789d09d9");
            expect(license.name).to.equal("simple license");
            expect(license.application.id).to.equal("3ccf0f1b-dd3f-48d9-911a-ddf479078c37");
            expect(license.status).to.equal(LicenseStatus.active);
        });

        it("should throw InvalidLicenseError when no license with the given key is found", async () => {
            nock("https://api.license.io")
                .post("/apps/v1/validate/key")
                .reply(404, licenseKeyNotFoundResponse);

            try {
                await validator.validateByKey("not-existing-key");
            } catch (err) {
                expect(err instanceof InvalidLicenseError).to.be.true;
            }
        });

    });

});
