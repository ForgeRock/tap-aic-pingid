# PingID Script Descriptions

This README gives a simple description of each script in the PingID/PingOne export.

| Script | Description |
| --- | --- |
| `getAccessToken` | Requests an OAuth access token from PingOne so the other scripts can call PingOne services. |
| `Read MFA Devices` | Looks up the user's registered MFA devices and decides whether the user has no devices, one device, or multiple devices. |
| `Select Device` | Shows the user a list of available MFA devices and saves the device they choose. |
| `Initialize Device Authentication` | Starts an MFA authentication challenge for the user, including number matching when PingOne returns a number. |
| `Display Number` | Shows the number-matching value that the user must approve in their authenticator app. |
| `Read Device Authentication` | Checks the current status of the MFA challenge and continues based on whether it is still pending, completed, or failed. |
| `Update User MFA Enabled` | Enables MFA for the user in PingOne. |
| `Create MFA Pairing Key` | Creates a pairing code and QR link so the user can register a new MFA device. |
| `Check Pairing Status` | Shows the pairing code and QR code, then checks whether the user has completed device registration. |


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

&copy; Copyright 2024 Ping Identity. All Rights Reserved

[pingidentity-logo]: https://www.pingidentity.com/content/dam/picr/nav/Ping-Logo-2.svg "Ping Identity Logo"
