var deviceAuthId = nodeState.get("deviceAuthId");
var accessToken = nodeState.get("pingAccessToken");
var envId = systemEnv.getProperty("esv.envid");
var otp = nodeState.get("otp");

if (!deviceAuthId || !accessToken || !envId || !otp) {
    nodeState.putShared("otpValidationError", "Missing deviceAuthId, accessToken, envId, or otp");
    action.goTo("error");
} else {
    var requestUrl = "https://auth.pingone.com/" + envId + "/deviceAuthentications/" + deviceAuthId;

    var payload = JSON.stringify({
        otp: String(otp)
    });

    var requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/vnd.pingidentity.otp.check+json",
            "Accept": "application/json"
        },
        token: accessToken,
        body: payload
    };

    try {
        var response = httpClient.send(requestUrl, requestOptions).get();

        if (!response) {
            nodeState.putShared("otpValidationError", "No response");
            action.goTo("error");
        } else if (!response.ok) {
            var errorBody = response.text();
            nodeState.putShared("otpHttpStatus", String(response.status));
            nodeState.putShared("otpResponseBody", errorBody);
            nodeState.putShared("otpValidationError", errorBody);
            action.goTo("invalid");
        } else {
            var body = response.json();
            var status = body && body.status ? String(body.status) : null;

            nodeState.putShared("otpValidationResponse", JSON.stringify(body));
            nodeState.putShared("deviceAuthStatus", status);

            if (status === "COMPLETED") {
                action.goTo("valid");
            } else {
                nodeState.putShared("otpValidationError", "Unexpected status: " + status);
                action.goTo("invalid");
            }
        }
    } catch (e) {
        nodeState.putShared("otpValidationError", String(e));
        action.goTo("error");
    }
}
