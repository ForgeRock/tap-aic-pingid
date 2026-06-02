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
  var environmentId = systemEnv.getProperty("esv.envid");
  var accessToken = nodeState.get("pingAccessToken");
  var userId = nodeState.get("pingOneUserId");

  var url =
    "https://api.pingone.com/v1/environments/" +
    environmentId +
    "/users/" +
    userId +
    "/devices";

  var requestOptions = {
    method: "GET",
    headers: {
      "Accept": "application/json"
    },
    token: accessToken
  };

  var response = httpClient.send(url, requestOptions).get();

  if (response.status !== 200) {
    logger.error("PingOne Devices API failed. Status: " + response.status);
    action.goTo("error");
  } else {
    var json = response.json();
    var count = json.count || 0;

    nodeState.putShared("devicesResponse", JSON.stringify(json));

    if (count === 0) {
      action.goTo("noDevices");
    } else if (count === 1) {
      var device = json._embedded.devices[0];

      nodeState.putShared("selectedDeviceId", device.id);
      nodeState.putShared("selectedDeviceNickname", device.nickname || device.id);

      action.goTo("singleDevice");
    } else {
      action.goTo("multipleDevices");
    }
  }
} catch (e) {
  logger.error("Exception calling PingOne Devices API: " + e);
  action.goTo("error");
}
