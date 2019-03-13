
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


### Offline validation by token

When your app needs to be able to validate licenses without a network connection
you can use the offline validation.

For this to work you need to specify one or more public certificates to verify
the signed license token. You can download these certificates in the dashboard. 

The certificate name as it is presented in the dashboard should be passed as the `name` when configuring a certificate, 
otherwise the validator will not be able to match a signed token to your certificate.

Certificates can be loaded from a file, from string or from a Buffer object. All certificates should be encoded in PEM format.

```javascript
const {OfflineValidator, Certificate, InvalidLicenseError, CertificateNotFoundError} = require('licenseio');

// initialize the validator your app ID and certificate
const validator = new OfflineValidator("3ccf0f1b-dd3f-48d9-911a-ddf479078c37",
    [Certificate.fromFile("certificateName", "/path/to/certificate.crt")]);

validator.validate("eyJraWQiOiJmaXJzdGtleSIsIng1dSI6Imh0dHBzOi8vZGV2LmxpY2Vuc2UuaW8vY2VydGlmaWNhdGVzLzNjY2YwZjFiLWRkM2YtNDhkOS05MTFhLWRkZjQ3OTA3OGMzNy9maXJzdGtleS5jcnQiLCJhbGciOiJSUzI1NiJ9.eyJzdGFydHNfYXQiOiIyMDE5LTAzLTA0VDEzOjEzOjEzLjU3NTMyN1oiLCJsaWNlbnNlZSI6eyJuYW1lIjoiU3RldmVuIFZhbiBCYWVsIiwiZW1haWwiOiJzdGV2ZW5AcXVhbnR1cy5pbyIsImNvbXBhbnkiOiJRdWFudHVzIEJWQkEifSwiY3JlYXRlZF9hdCI6IjIwMTktMDMtMDRUMTM6MTM6MTMuNTc1MzI3WiIsInZlcnNpb24iOnsibWluIjp7ImNvZGUiOjAsIm5hbWUiOiIxLjAuMCJ9LCJtYXgiOnsiY29kZSI6MTAwMCwibmFtZSI6IjIuMC4wIn19LCJsaWNlbnNlX2tleSI6ImRlbW8tbGljZW5zZS1rZXkiLCJleHBpcmF0aW9uX3R5cGUiOiJkYXRlIiwiZmVhdHVyZXMiOltdLCJleHBpcmVzX2F0IjoiMjAyNC0xMi0zMVQyMzowMDowMFoiLCJhcHBsaWNhdGlvbiI6eyJpZCI6IjNjY2YwZjFiLWRkM2YtNDhkOS05MTFhLWRkZjQ3OTA3OGMzNyIsIm5hbWUiOiJRdWFudHVzIFRhc2tzIn0sInVwZGF0ZWRfYXQiOiIyMDE5LTAzLTA0VDEzOjEzOjEzLjU3NTMyN1oiLCJuYW1lIjoic2ltcGxlIGxpY2Vuc2UiLCJsaW5rcyI6W10sImlkIjoiMjQxOWVmZjktODIxMi00YTA5LWJmMDAtYzY3Zjc4OWQwOWQ5IiwicGFyYW1ldGVycyI6e30sInN0YXR1cyI6ImFjdGl2ZSJ9.EPPAG1dMUzdq2S39JJY5aZmUeHjxrby9v2wVn_oiUKK8GGRXGm5oqKqNeKjMtlGJjLG69SuMx8EpKlSWtPCD9YhKR9OoEa_8pgDRFeQK9MMp9Jy-mS6CKwdFoEXrUGJeKUZjSxQKyM3BHDumxkpyGalFGPCccfJAeMO0ujwPMCt8-I_Gz3cm66lWvpf07OBI0iaN1H6CrLiYspo7U-FQiHriRzFpiw_S6vISbHLqg5_HVn3RGQqxnmRferZYs4Z_E4p1jEEZf0k3anv9711HipV6pXrqg5XSIBfLw1AWLE9f_1R-65TZxro4Jq5_pEpq2reHz8owAj306CzQa-ecgw")
    .then((license) => {
        console.log(`Got license with id ${license.id} and name ${license.name} and status ${license.status}`);
        console.log(`full license\n${JSON.stringify(license)}`);
    }).catch((err) => {
        if (err instanceof InvalidLicenseError) {
            console.log("The given license token was invalid");
        } else if (err instanceof CertificateNotFoundError) {
            console.log("To certificate for this token is not found in the certificates list");
        } else {
            console.log(`an error happened ${err}`);
        }
    })
```


