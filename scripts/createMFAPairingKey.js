/**
 * Commit: 65a805b
 * Created by the Ping Identity Technology Alliance Partner (TAP) team
 *
 * For support, contact Ping Identity Support
 * or email: tap-global@pingidentity.com
 *
 * Version: 1.5
 */

var accessToken = nodeState.get("pingAccessToken");
var userId = nodeState.get("pingOneUserId");
var envId = systemEnv.getProperty("esv.envid");
var policyid = systemEnv.getProperty("esv.policyid");
var applicationid = systemEnv.getProperty("esv.applicationid");

var url = `https://api.pingone.com/v1/environments/${envId}/users/${userId}/pairingKeys`;

var requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  token: accessToken,
  body: {
    applications: [
      {
        id: applicationid
      }
    ],
    policy: {
      id: policyid
    }
  }
};

try {
  var response = httpClient.send(url, requestOptions).get();

  if (response.ok) {
    var responseJson = response.json();

    // Store the returned pairing code in shared state.
    nodeState.putShared("pairingKeyCode", responseJson.code);
      nodeState.putShared("pairingKeyId", responseJson.id);
      nodeState.putShared("pairingKeyUri", responseJson.uri);


    action.goTo("true");
  } else {
    logger.error("Pairing key request failed: " + response.status + " " + response.text());
    nodeState.putShared("pairingKeyError", response.text());
    action.goTo("false");
  }
} catch (e) {
  logger.error("Pairing key request exception: " + e);
  nodeState.putShared("pairingKeyError", String(e));
  action.goTo("false");
}
