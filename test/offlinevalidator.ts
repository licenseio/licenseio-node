import {expect} from "chai";
import {
    Certificate,
    CertificateNotFoundError,
    InvalidLicenseError,
    LicenseStatus,
    OfflineValidator
} from "../src/licenseio";
import assert = require("assert");

const VALID_CERT = "-----BEGIN CERTIFICATE-----\n" +
    "MIICrzCCAZegAwIBAgIJAJ4rNZtxGNA0MA0GCSqGSIb3DQEBCwUAMBcxFTATBgNV\n" +
    "BAMTDFF1YW50dXMgQlZCQTAeFw0xODAzMDUxNjAyMjlaFw0zODAyMjgxNjAyMjla\n" +
    "MBcxFTATBgNVBAMTDFF1YW50dXMgQlZCQTCCASIwDQYJKoZIhvcNAQEBBQADggEP\n" +
    "ADCCAQoCggEBAJk9x0N8wcklReGneQ6SyoSLXOm+8EBO9dmgEmSQtV81/Z2ZZzUl\n" +
    "k1fMufh4hIBwIKJev8Gklv9I82U5ZKVm6r67kv7Zbf8IlgNFUNeQrNP8nrGyxmfK\n" +
    "fYpW2Qxw6ym2i48EFCLx2JMVhxqLQ4GzD9RVjui+Ygvpi5YayJVnjjP+lBl8ZASH\n" +
    "y6SIiv/O7TkOPRq2xHehbgNQXr8CyDYEdu8WR0x07eMG8RErvdu9OjH/59xeQQGP\n" +
    "FDJnD9dCYEQkRmq7hyZOF0Cp6BP4be0dqRq8TZv8MvZA1HF7ull1NrCnTnMOq0TJ\n" +
    "BhPcq61Iu1OZlBne2su68wNzgFVUlrL3W2cCAwEAATANBgkqhkiG9w0BAQsFAAOC\n" +
    "AQEADVJS2qOhOiC4hQtAMcyAaJs6yKG5IfMKO2ElqCkP2Afe/zphyDI2lvQTtqLW\n" +
    "7N02m7SgX9zdAuDmMI9B7pzJpJ9W7wj4s0BIxTPyVX9GQ+zhUlL+GdFsRTZpXEsM\n" +
    "8rGuhydAApMzB9jgV1+iFw4KeXIwo++dVLYyMZQj6lkqKEnZy0kDj9uWIpXHRHzF\n" +
    "Hp4qwLXzJBdpJZpGE8umIXmcg2t0XlB7OlDjayTdwi01u+h4Qf35zWjY47+n+n2u\n" +
    "itAkhdtyiYu4fgICI9Hi8Zywo5iBTUlk0zMATYv6tiT7Rn4SGucqN5CeNspt3jE5\n" +
    "rtqqWG0WMKy/1lAYC6yGVcCS2A==\n" +
    "-----END CERTIFICATE-----";

const VALID_TOKEN = "eyJraWQiOiJmaXJzdGtleSIsIng1dSI6Imh0dHBzOi8vZGV2LmxpY2Vuc2UuaW8vY2VydGlmaWNhdGVzLzNjY2YwZjFiLWRkM2YtNDhkOS05MTFhLWRkZjQ3OTA3OGMzNy9maXJzdGtleS5jcnQiLCJhbGciOiJSUzI1NiJ9.eyJzdGFydHNfYXQiOiIyMDE5LTAzLTA0VDEzOjEzOjEzLjU3NTMyN1oiLCJsaWNlbnNlZSI6eyJuYW1lIjoiU3RldmVuIFZhbiBCYWVsIiwiZW1haWwiOiJzdGV2ZW5AcXVhbnR1cy5pbyIsImNvbXBhbnkiOiJRdWFudHVzIEJWQkEifSwiY3JlYXRlZF9hdCI6IjIwMTktMDMtMDRUMTM6MTM6MTMuNTc1MzI3WiIsInZlcnNpb24iOnsibWluIjp7ImNvZGUiOjAsIm5hbWUiOiIxLjAuMCJ9LCJtYXgiOnsiY29kZSI6MTAwMCwibmFtZSI6IjIuMC4wIn19LCJsaWNlbnNlX2tleSI6ImRlbW8tbGljZW5zZS1rZXkiLCJleHBpcmF0aW9uX3R5cGUiOiJkYXRlIiwiZmVhdHVyZXMiOltdLCJleHBpcmVzX2F0IjoiMjAyNC0xMi0zMVQyMzowMDowMFoiLCJhcHBsaWNhdGlvbiI6eyJpZCI6IjNjY2YwZjFiLWRkM2YtNDhkOS05MTFhLWRkZjQ3OTA3OGMzNyIsIm5hbWUiOiJRdWFudHVzIFRhc2tzIn0sInVwZGF0ZWRfYXQiOiIyMDE5LTAzLTA0VDEzOjEzOjEzLjU3NTMyN1oiLCJuYW1lIjoic2ltcGxlIGxpY2Vuc2UiLCJsaW5rcyI6W10sImlkIjoiMjQxOWVmZjktODIxMi00YTA5LWJmMDAtYzY3Zjc4OWQwOWQ5IiwicGFyYW1ldGVycyI6e30sInN0YXR1cyI6ImFjdGl2ZSJ9.EPPAG1dMUzdq2S39JJY5aZmUeHjxrby9v2wVn_oiUKK8GGRXGm5oqKqNeKjMtlGJjLG69SuMx8EpKlSWtPCD9YhKR9OoEa_8pgDRFeQK9MMp9Jy-mS6CKwdFoEXrUGJeKUZjSxQKyM3BHDumxkpyGalFGPCccfJAeMO0ujwPMCt8-I_Gz3cm66lWvpf07OBI0iaN1H6CrLiYspo7U-FQiHriRzFpiw_S6vISbHLqg5_HVn3RGQqxnmRferZYs4Z_E4p1jEEZf0k3anv9711HipV6pXrqg5XSIBfLw1AWLE9f_1R-65TZxro4Jq5_pEpq2reHz8owAj306CzQa-ecgw";

describe("Certificate", () => {
    describe("fromString", () => {
        it("should construct a valid certificate", () => {
            const cert = Certificate.fromString("firstkey", VALID_CERT);
            expect(cert.name).to.equal("firstkey");
            expect(cert.pemData.length).to.equal(992);
        });
    });
    describe("fromBuffer", () => {
        it("should construct a valid certificate", () => {
            const cert = Certificate.fromBuffer("firstkey", new Buffer(VALID_CERT));
            expect(cert.name).to.equal("firstkey");
            expect(cert.pemData.length).to.equal(992);
        });
    });
    describe("fromFile", () => {
        it("should construct a valid certificate", () => {
            const cert = Certificate.fromFile("firstkey", "test/firstkey.crt");
            expect(cert.name).to.equal("firstkey");
            expect(cert.pemData.length).to.equal(992);
        });
    });
});

describe("OfflineValidator", () => {
    describe("constructor", () => {
        it("should construct a proper validator", () => {
            const validator = new OfflineValidator(
                "3ccf0f1b-dd3f-48d9-911a-ddf479078c37",
                [Certificate.fromString("firstkey", VALID_CERT)]);
            expect(validator.appId).to.equal("3ccf0f1b-dd3f-48d9-911a-ddf479078c37");
            expect(validator.certificates.length).to.equal(1);
            expect(validator.certificates[0].name).to.equal("firstkey");
        });
    });

    describe("validateByToken", () => {
        it("should return a valid License promise", async () => {
            const validator = new OfflineValidator(
                "3ccf0f1b-dd3f-48d9-911a-ddf479078c37",
                [Certificate.fromString("firstkey", VALID_CERT)]);
            const license = await validator.validateByToken(VALID_TOKEN);
            expect(license.id).to.equal("2419eff9-8212-4a09-bf00-c67f789d09d9");
            expect(license.name).to.equal("simple license");
            expect(license.application.id).to.equal("3ccf0f1b-dd3f-48d9-911a-ddf479078c37");
            expect(license.status).to.equal(LicenseStatus.active);
        });

        it("should throw InvalidLicenseError when an invalidToken is found", async () => {
            const validator = new OfflineValidator(
                "3ccf0f1b-dd3f-48d9-911a-ddf479078c37",
                [Certificate.fromString("firstkey", VALID_CERT)]);
            try {
                await validator.validateByToken("invalid-token");
                assert.fail("Should not be reached");
            } catch (err) {
                expect(err instanceof InvalidLicenseError).to.be.true;
            }
        });

        it("should throw InvalidLicenseError when the token is signed with a kid not in the certificates list", async () => {
            const validator = new OfflineValidator(
                "3ccf0f1b-dd3f-48d9-911a-ddf479078c37",
                []);
            try {
                await validator.validateByToken(VALID_TOKEN);
                assert.fail("Should not be reached");
            } catch (err) {
                expect(err instanceof CertificateNotFoundError).to.be.true;
            }
        });
    });

});
