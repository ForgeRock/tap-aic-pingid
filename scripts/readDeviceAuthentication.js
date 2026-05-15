var deviceAuthId = nodeState.get("deviceAuthId");
var accessToken = nodeState.get("pingAccessToken");
var envId = systemEnv.getProperty("esv.envid");

var nowMs = new Date().getTime();
var timeoutMs = 60000; // 60 seconds local timeout

var pushStartTimeMs = nodeState.get("pushStartTimeMs");
if (!pushStartTimeMs) {
    pushStartTimeMs = String(nowMs);
    nodeState.putShared("pushStartTimeMs", pushStartTimeMs);
}

if (!deviceAuthId || !accessToken || !envId) {
    logger.error("Missing required state. envId/deviceAuthId/accessToken must be present.");
    nodeState.putShared("deviceAuthStatusError", "Missing envId, deviceAuthId, or accessToken");
    action.goTo("error");

} else {
    var requestUrl = "https://auth.pingone.com/" + envId + "/deviceAuthentications/" + deviceAuthId;

    var requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
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
                var elapsedMs = nowMs - parseInt(String(pushStartTimeMs), 10);

                if (elapsedMs >= timeoutMs) {
                    logger.error("Push confirmation timed out locally after " + elapsedMs + " ms");
                    nodeState.putShared("pushTimedOut", "true");
                    nodeState.putShared("pushStartTimeMs", "");
                    action.goTo("otpFallback");
                } else {
                    action.goTo("polling");
                }

            } else if (status === "PUSH_CONFIRMATION_TIMED_OUT") {
                logger.error("Push confirmation timed out in PingOne");
                nodeState.putShared("pushTimedOut", "true");
                nodeState.putShared("pushStartTimeMs", "");
                action.goTo("otpFallback");

            } else if (status === "COMPLETED") {
                nodeState.putShared("pushTimedOut", "false");
                nodeState.putShared("pushStartTimeMs", "");
                action.goTo("completed");

            } else {
                logger.error("Unexpected device authentication status: " + status);
                nodeState.putShared("deviceAuthStatusError", "Unexpected status: " + status);
                nodeState.putShared("pushStartTimeMs", "");
                action.goTo("error");
            }
        }

    } catch (e) {
        logger.error("Exception while calling device authentication API: " + e);
        nodeState.putShared("deviceAuthStatusError", String(e));
        nodeState.putShared("pushStartTimeMs", "");
        action.goTo("error");
    }
}