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
    var accessToken = nodeState.get("pingAccessToken");
    var userId = nodeState.get("pingOneUserId");
    var envId = systemEnv.getProperty("esv.envid");

    if (!accessToken || !userId || !envId) {
        logger.error("Missing required values. accessToken=" + !!accessToken +
                     ", userId=" + !!userId +
                     ", envId=" + !!envId);
        action.goTo("error");
    } else {
        var requestUrl = "https://api.pingone.com/v1/environments/"
            + encodeURIComponent(envId)
            + "/users/"
            + encodeURIComponent(userId)
            + "/mfaEnabled";

        var options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            token: accessToken,
            body: {
                mfaEnabled: true
            }
        };

        var response = httpClient.send(requestUrl, options).get();

        logger.info("PingOne MFA enable response status: {}", response.status);

        if (response.status >= 200 && response.status < 300) {
            nodeState.putShared("mfaEnabledResult", "success");
            action.goTo("success");
        } else {
            var responseBody = "";
            try {
                responseBody = response.text();
            } catch (ignore) {}

            logger.error("PingOne MFA enable failed. Status: " +
                         response.status + ", Body: " + responseBody);

            nodeState.putShared("mfaEnabledResult", "failed");
            nodeState.putShared("mfaEnabledStatus", String(response.status));
            nodeState.putShared("mfaEnabledBody", responseBody);

            action.goTo("error");
        }
    }
} catch (e) {
    logger.error("Exception enabling MFA: {}", String(e));
    nodeState.putShared("mfaEnabledResult", "exception");
    nodeState.putShared("mfaEnabledException", String(e));
    action.goTo("error");
}
