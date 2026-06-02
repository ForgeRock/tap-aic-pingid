/**
 * Commit: d66f95b
 * Created by the Ping Identity Technology Alliance Partner (TAP) team
 *
 * For support, contact Ping Identity Support
 * or email: tap-global@pingidentity.com
 *
 * Version: 1.5
 */

try {
    var accessToken = nodeState.get("pingAccessToken");
    var userId = nodeState.get("pingOneUserId");
    var envId = systemEnv.getProperty("esv.envid");
    var deviceId = nodeState.get("selectedDeviceId");

    if (!accessToken || !userId || !envId || !deviceId) {
        logger.error("Missing required values.");
        action.goTo("error");
    } else {
        var requestUrl = "https://api.pingone.com/v1/environments/"
            + encodeURIComponent(envId)
            + "/users/"
            + encodeURIComponent(userId)
            + "/devices/"
            + encodeURIComponent(deviceId);

        var requestOptions = {
            method: "DELETE",
            headers: {
                "Accept": "application/json"
            },
            token: accessToken
        };

        var response = httpClient.send(requestUrl, requestOptions).get();

        logger.info("PingOne remove MFA device response status: {}", response.status);

        if (response.status >= 200 && response.status < 300) {
            action.goTo("success");
        } else {
            var responseBody = "";
            try {
                responseBody = response.text();
            } catch (ignore) {}

            logger.error("PingOne remove MFA device failed. Status: " +
                         response.status + ", Body: " + responseBody);

            action.goTo("error");
        }
    }
} catch (e) {
    logger.error("Exception removing MFA device: {}", String(e));
    action.goTo("error");
}
