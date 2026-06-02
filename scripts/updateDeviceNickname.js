/**
 * Commit: 65a805b
 * Created by the Ping Identity Technology Alliance Partner (TAP) team
 *
 * For support, contact Ping Identity Support
 * or email: tap-global@pingidentity.com
 *
 * Version: 1.5
 */

try {
    if (callbacks.isEmpty()) {
        callbacksBuilder.textInputCallback("Enter a nickname for this device");
    } else {
        var enteredValue = callbacks.getTextInputCallbacks().get(0);

        var accessToken = nodeState.get("pingAccessToken");
        var userId = nodeState.get("pingOneUserId");
        var envId = systemEnv.getProperty("esv.envid");
        var deviceId = nodeState.get("selectedDeviceId");

        if (!accessToken || !userId || !envId || !deviceId) {
            logger.error("Missing required values");
            action.goTo("error");
        } else {
            var requestUrl = "https://api.pingone.com/v1/environments/"
                + encodeURIComponent(envId)
                + "/users/"
                + encodeURIComponent(userId)
                + "/devices/"
                + encodeURIComponent(deviceId)
                + "/nickname";

            var requestOptions = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                token: accessToken,
                body: {
                    nickname: enteredValue
                }
            };

            var response = httpClient.send(requestUrl, requestOptions).get();

            logger.info("PingOne update device nickname response status: {}", response.status);

            if (response.status >= 200 && response.status < 300) {
                action.goTo("success");
            } else {
                var responseBody = "";
                try {
                    responseBody = response.text();
                } catch (ignore) {}

                logger.error("PingOne update device nickname failed. Status: " +
                             response.status + ", Body: " + responseBody);

                action.goTo("error");
            }
        }
    }
} catch (e) {
    logger.error("Exception updating device nickname: {}", String(e));
    action.goTo("error");
}
