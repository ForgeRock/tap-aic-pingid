/**
 * Commit: d66f95b
 * Created by the Ping Identity Technology Alliance Partner (TAP) team
 *
 * For support, contact Ping Identity Support
 * or email: tap-global@pingidentity.com
 *
 * Version: 1.5
 */

var envId = systemEnv.getProperty("esv.envid");
var clientId = systemEnv.getProperty("esv.clientid");

// Prefer storing this as an ESV secret, not hardcoding it.
var clientSecret = systemEnv.getProperty("esv.identifier");

var tokenUrl = "https://auth.pingone.com/" + envId + "/as/token";
var basicAuth = utils.base64.encode(clientId.concat(":").concat(clientSecret));

var requestOptions = {
  method: "POST",
  headers: {
    "Authorization": "Basic ".concat(basicAuth)
  },
  form: {
    grant_type: "client_credentials"
  }
};

var response = httpClient.send(tokenUrl, requestOptions).get();

if (response && response.status === 200) {
  var tokenResponse = response.json();

  nodeState.putShared("pingAccessToken", tokenResponse.access_token);

  // Optional: store full token response if needed by later nodes
  // nodeState.putShared("token_response", tokenResponse);

  action.goTo("true");
} else {
  logger.error("Token request failed. Status: " + (response ? response.status : "no response"));
  action.goTo("false");
}
