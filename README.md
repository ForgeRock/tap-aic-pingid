# PingID Journey with Scripted Decision Nodes

This README gives a simple description of each script in the PingID/PingOne export, including the ESVs used by the scripts and the outcomes that must be configured on each scripted decision node.

## Required ESVs

| ESV | Purpose |
| --- | --- |
| `esv.envid` | PingOne environment ID used when calling PingOne API endpoints. |
| `esv.clientid` | Client ID used to request the PingOne OAuth access token. |
| `esv.identifier` | Client secret used to request the PingOne OAuth access token. |
| `esv.policyid` | PingOne MFA policy ID used when creating a pairing key. |
| `esv.applicationid` | PingOne application ID used when creating a pairing key. |


## PingOne Worker Service setup

https://docs.pingidentity.com/pingoneaic/integrations/pingone-set-up-workers.html#configure-the-service

## Scripts

| Script | Description | ESVs Needed | Outcomes to Configure |
| --- | --- | --- | --- |
| `getAccessToken` | Requests an OAuth access token from PingOne so the other scripts can call PingOne services. | `esv.envid`, `esv.clientid`, `esv.identifier` | `true`, `false` |
| `Read MFA Devices` | Looks up the user's registered MFA devices and decides whether the user has no devices, one device, or multiple devices. | `esv.envid` | `multipleDevices`, `noDevices`, `error`, `singleDevice` |
| `Select Device` | Shows the user a list of available MFA devices and saves the device they choose. | None | `selected`, `error` |
| `Initialize Device Authentication` | Starts an MFA authentication challenge for the user, including number matching when PingOne returns a number. | `esv.envid` | `Success`, `Failure` |
| `Display Number` | Shows the number-matching value that the user must approve in their authenticator app. | None | `true` |
| `Read Device Authentication` | Checks the current status of the MFA challenge and continues based on whether it is still pending, completed, or failed. | `esv.envid` | `completed`, `polling`, `error` |
| `Update User MFA Enabled` | Enables MFA for the user in PingOne. | `esv.envid` | `success`, `error` |
| `Create MFA Pairing Key` | Creates a pairing code and QR link so the user can register a new MFA device. | `esv.envid`, `esv.policyid`, `esv.applicationid` | `true`, `false` |
| `Check Pairing Status` | Shows the pairing code and QR code, then checks whether the user has completed device registration. | `esv.envid` | `true` |

> Outcome names are case-sensitive and must match the script exactly.


<!-- SUPPORT -->
## Support

If you encounter any issues, be sure to check our https://docs.pingidentity.com/ pages.

Support tickets can be raised whenever you need our assistance; here are some examples of when it is appropriate to open a ticket (but not limited to):

* Suspected bugs or problems with Ping Identity software.
* Requests for assistance

You can raise a ticket using **[Ping Identity Support Portal](https://support.pingidentity.com/s/)**, our customer support portal that provides one stop access to Ping Identity services.

<!-- COLLABORATION -->

## Contributing

This Ping Identity project does not accept third-party code submissions.

<!------------------------------------------------------------------------------------------------------------------------------------>
<!-- LEGAL -->

## Disclaimer

> **This code is provided by Ping Identity on an “as is” basis, without warranty of any kind, to the fullest extent permitted by law.
>Ping Identity does not represent or warrant or make any guarantee regarding the use of this code or the accuracy,
>timeliness or completeness of any data or information relating to this code, and Ping Identity hereby disclaims all warranties whether express,
>or implied or statutory, including without limitation the implied warranties of merchantability, fitness for a particular purpose,
>and any warranty of non-infringement. Ping Identity shall not have any liability arising out of or related to any use,
>implementation or configuration of this code, including but not limited to use for any commercial purpose.
>Any action or suit relating to the use of the code may be brought only in the courts of a jurisdiction wherein
>Ping Identity resides or in which Ping Identity conducts its primary business, and under the laws of that jurisdiction excluding its conflict-of-law provisions.**

<!------------------------------------------------------------------------------------------------------------------------------------>
<!-- LICENSE - Links to the MIT LICENSE file in each repo. -->

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

---

&copy; Copyright 2026 Ping Identity. All Rights Reserved

[pingidentity-logo]: https://www.pingidentity.com/content/dam/picr/nav/Ping-Logo-2.svg "Ping Identity Logo"
