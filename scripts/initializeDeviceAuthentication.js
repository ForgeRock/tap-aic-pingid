/**
 * Commit: 65a805b
 * Created by the Ping Identity Technology Alliance Partner (TAP) team
 *
 * For support, contact Ping Identity Support
 * or email: tap-global@pingidentity.com
 *
 * Version: 1.5
 */

var envId = systemEnv.getProperty("esv.envid");
var accessToken = nodeState.get("pingAccessToken");
var userId = nodeState.get("pingOneUserId");

if (!envId || !accessToken || !userId) {
  logger.error("Missing required input(s): pingOneEnvId, pingOneAccessToken, or pingOneUserId");
  action.goTo("Failure");
} else {
  var requestUrl = "https://auth.pingone.com/" + envId + "/deviceAuthentications";

  var selectedDeviceId = nodeState.get("selectedDeviceId");

    // Base body (always present)
    var body = {
      user: {
        id: userId
      }
    };
    
    // Only add device + compatibility if deviceId exists
    if (selectedDeviceId) {
      body.device = {
        id: selectedDeviceId
      };
      body.compatibility = "FULL";
    }
    
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      token: accessToken,
      body: body
    };

  try {
    var response = httpClient.send(requestUrl, requestOptions).get();

    logger.info("deviceAuthentications response status: " + response.status);

    if (response.status >= 200 && response.status < 300) {
      var responseText = response.text();

      try {
        var json = response.json();


        var numberMatched = json && json.numberMatching ? String(json.numberMatching.number) : null;
        nodeState.putShared("numberMatched", numberMatched);

        // Extract deviceAuthId (matches your Postman logic)
        var deviceAuthId = json && json.id ? String(json.id) : null;

        if (deviceAuthId) {

          // Save to shared state for downstream nodes
          nodeState.putShared("deviceAuthId", deviceAuthId);

          action.goTo("Success");
        } else {
          logger.error("Response JSON did not contain a valid 'id'");
          nodeState.putShared("deviceAuthenticationsError", "Missing id in response");
          action.goTo("Failure");
        }

      } catch (parseError) {
        logger.error("Failed to parse JSON response: " + parseError);
        nodeState.putShared("deviceAuthenticationsError", "Invalid JSON response");
        action.goTo("Failure");
      }

    } else {
      var errorBody = response.text();
      logger.error("deviceAuthentications call failed. Status: " + response.status + ", body: " + errorBody);
      nodeState.putShared("deviceAuthenticationsError", errorBody);
      action.goTo("Failure");
    }

  } catch (e) {
    logger.error("Exception calling deviceAuthentications endpoint: " + e);
    nodeState.putShared("deviceAuthenticationsError", String(e));
    action.goTo("Failure");
  }
}
