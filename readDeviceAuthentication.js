/**
 * Created by the Ping Identity Technology Alliance Partner (TAP) team
 *
 * For support, contact Ping Identity Support
 * or email: tap-global@pingidentity.com
 *
 * Version: 1.5
 */

var deviceAuthId = nodeState.get("deviceAuthId");
var accessToken = nodeState.get("pingAccessToken");
var envId = systemEnv.getProperty("esv.envid");

if (!deviceAuthId || !accessToken || !envId) {
    logger.error("Missing required state. envId/deviceAuthId/accessToken must be present.");
    nodeState.putShared("deviceAuthStatusError", "Missing envId, deviceAuthId, or accessToken");
    action.goTo("error");
} else {
    var requestUrl = "https://auth.pingone.com/" + envId + "/deviceAuthentications/" + deviceAuthId;

    var requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        token: accessToken
    };

    try {
        var response = httpClient.send(requestUrl, requestOptions).get();

        if (!response) {
            logger.error("No response returned from device authentication API");
            nodeState.putShared("deviceAuthStatusError", "No response returned from API");
            action.goTo("error");
        } else if (!response.ok) {
            var errorBody = response.text();
            logger.error("Device authentication API call failed. HTTP status: " + response.status + ", body: " + errorBody);
            nodeState.putShared("deviceAuthHttpStatus", String(response.status));
            nodeState.putShared("deviceAuthStatusError", errorBody);
            action.goTo("error");
        } else {
            var body = response.json();
            var status = body && body.status ? String(body.status) : null;


            nodeState.putShared("deviceAuthApiResponse", JSON.stringify(body));
            nodeState.putShared("deviceAuthStatus", status);

            if (status === "PUSH_CONFIRMATION_REQUIRED") {
                action.goTo("polling");
            } else if (status === "COMPLETED") {
                action.goTo("completed");
            } else {
                logger.error("Unexpected device authentication status: " + status);
                nodeState.putShared("deviceAuthStatusError", "Unexpected status: " + status);
                action.goTo("error");
            }
        }
    } catch (e) {
        logger.error("Exception while calling device authentication API: " + e);
        nodeState.putShared("deviceAuthStatusError", String(e));
        action.goTo("error");
    }
}
