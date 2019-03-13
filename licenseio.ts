
// defaults
const BASE_URL = "https://api.license.io";

export class OnlineValidator {
    public readonly baseUrl: string;
    public readonly appId: string;

    constructor(appId: string, baseUrl = BASE_URL) {
        this.baseUrl = baseUrl;
        this.appId = appId;
    }

    public validateByKey(key: string) {
        return new Promise((resolve, reject) => {

            resolve({});

        });
    }
}

// const onlineValidator = (options) => {
//
//     if (!options.app_id) {
//         throw new Error('app_id is mandatory')
//     }
//
//     return new OnlineValidator(
//         options.base_url ? options.base_url : BASE_URL,
//         options.app_id
//     );
//
//
// };


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

