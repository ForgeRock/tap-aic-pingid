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
