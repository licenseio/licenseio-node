import request from "request-promise";
import {StatusCodeError} from "request-promise/errors";
import * as fs from "fs";
import * as jwt from "jsonwebtoken";
import {JsonWebTokenError} from "jsonwebtoken";

// defaults
const BASE_URL = "https://api.license.io";

export class InvalidLicenseError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidLicenseError.prototype);
    }
}

export class CertificateNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CertificateNotFoundError.prototype);
    }
}

export interface Application {
    id: string;
    name: string;
}

export interface Licensee {
    name: string;
    email: string;
    company: string;
}

export interface License {
    id: string;
    name: string;
    status: LicenseStatus;
    licensee: Licensee;
    application: Application;
}

export enum LicenseStatus {
    pending = "pending",
    active = "active",
    expired = "expired",
    cancelled = "cancelled",
}

export class OnlineValidator {
    public readonly baseUrl: string;
    public readonly appId: string;

    constructor(appId: string, baseUrl = BASE_URL) {
        this.baseUrl = baseUrl;
        this.appId = appId;
    }

    public validateByKey(key: string): Promise<License> {
        return new Promise((resolve, reject) => {

            const options = {
                method: "POST",
                uri: `${this.baseUrl}/apps/v1/validate/key`,
                headers: {
                    "X-Licenseio-app-id": this.appId,
                },
                body: {
                    key: key,
                },
                json: true,
            };

            request(options).then(resolve).catch((err) => {
                if (err instanceof StatusCodeError) {
                    reject(new InvalidLicenseError("License Key not found"));
                } else {
                    reject(err);
                }
            });
        });
    }

    // TODO validateByToken(token: String)
}

export class Certificate {
    public readonly name: string;
    public readonly pemData: Buffer;

    static fromString(name: string, pemData: string): Certificate {
        return new Certificate(name, new Buffer(pemData));
    }

    static fromBuffer(name: string, pemData: Buffer): Certificate {
        return new Certificate(name, pemData);
    }

    static fromFile(name: string, filePath: string): Certificate {
        let pemData: Buffer = fs.readFileSync(filePath);
        return new Certificate(name, pemData);
    }

    private constructor(name: string, pemData: Buffer) {
        this.name = name;
        this.pemData = pemData;
    }
}

export class OfflineValidator {

    public appId: string;
    public certificates: Certificate[];

    constructor(appId: string, certificates: Certificate[] = []) {
        this.appId = appId;
        this.certificates = certificates;
    }

    // function for retrieving the certificate date by kid
    private getKey(header: any, callback: any) {
        for (let i = 0; i < this.certificates.length; i++) {
            if (header.kid == this.certificates[i].name) {
                return callback(null, this.certificates[i].pemData);
            }
        }
        return callback(new InvalidLicenseError(`No certificate found with name ${header.kid}`));
    }

    public validateByToken(token: string): Promise<License> {
        const validator = this;

        const getKeyFunc = (header: any, cb: any) => {
            validator.getKey(header, cb);
        };

        return new Promise((resolve, reject) => {
            // TODO loop over all certificates
            jwt.verify(token, getKeyFunc, (err, decoded) => {
                if (err) {
                    if (err instanceof JsonWebTokenError) {
                        // wrap some of the jsonwebtokenerrors in our own error object
                        if (err.message === "jwt malformed") {
                            return reject(new InvalidLicenseError("The license token could not be verified with the given certificates"));
                        }
                        if (err.message.indexOf("No certificate found with name")) {
                            return reject(new CertificateNotFoundError(err.message.substr(err.message.indexOf(":"))));
                        }
                    }
                    reject(err);
                } else {
                    resolve(decoded as License);
                }
            });
        });
    }
}
