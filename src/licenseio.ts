import request from "request-promise";

// defaults
const BASE_URL = "https://api.license.io";

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

            request(options).then(resolve).catch(reject);
        });
    }
}


/**
 * example usage
 * -------------
 * const license = require('licenseio')
 * 
 * const validator = license.onlineValidator({
 *  base_url: 'https://api.license.io',
 *  app_ud: 'fd0bfc5e-03e1-4dae-806a-97c25c295482'
 * });
 *
 * validator.validateByKey('abcd-efgh-ijkl-mn')
 *  .then((license) => {
 *      // succesful license
 *  }, (error) => {
 *      // something went wrong
 *  });
 *
 *
 */

