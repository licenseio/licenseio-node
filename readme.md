
This is the Javascript SDK for [License.io](https://license.io)

## Installation

```sh
$ npm install --save licenseio
```

## Usage

### Online validation by key

The simplest way to validate a license is to validate the short license key
against the API.

```javascript
const {OnlineValidator, InvalidLicenseError} = require('licenseio');

// initialize the validator with your app ID
const validator = new OnlineValidator("3ccf0f1b-dd3f-48d9-911a-ddf479078c37");

validator.validateByKey("demo-license-key")
    .then((license) => {
        console.log(`Got license with id ${license.id} and name ${license.name} and status ${license.status}`);
        console.log(`full license\n${JSON.stringify(license)}`);
    }).catch((err) => {
        if (err instanceof InvalidLicenseError) {
            console.log("The given license key was invalid");
        } else {
            console.log(`an error happened ${err}`);
        }
    })
```

