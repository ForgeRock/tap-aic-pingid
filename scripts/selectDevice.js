/**
 * Commit: a4fb9a2
 * Created by the Ping Identity Technology Alliance Partner (TAP) team
 *
 * For support, contact Ping Identity Support
 * or email: tap-global@pingidentity.com
 *
 * Version: 1.5
 */

try {
  var devicesJson = nodeState.get("devicesResponse");
  var devicesResponse = JSON.parse(devicesJson);

  var devices = devicesResponse._embedded.devices;

  var choices = [];
  var deviceIds = [];

  for (var i = 0; i < devices.length; i++) {
    var d = devices[i];

    var label = d.nickname ||
            (d.model && d.model.marketingName) ||
            d.id;

    if (d.os && d.os.type) {
      label += " - " + d.os.type;
    }

    choices.push(label);
    deviceIds.push(d.id);
  }

  if (callbacks.isEmpty()) {
    callbacksBuilder.choiceCallback(
      "Select the device you want to use",
      choices,
      0,
      false
    );
  } else {
    var selectedIndex = callbacks.getChoiceCallbacks().get(0)[0];

    var selectedDeviceId = deviceIds[selectedIndex];
    var selectedDeviceLabel = choices[selectedIndex];

    nodeState.putShared("selectedDeviceId", selectedDeviceId);
    nodeState.putShared("selectedDeviceLabel", selectedDeviceLabel);

    action.goTo("selected");
  }

} catch (e) {
  logger.error("Error rendering device choices: " + e);
  action.goTo("error");
}
