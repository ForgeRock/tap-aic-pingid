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
var pairingCode = nodeState.get("pairingKeyCode");
var pairingKeyId = nodeState.get("pairingKeyId");


var requestOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  },
  token: accessToken
};



var pairingKey = nodeState.get("pairingKeyUri"); // <-- use your actual sharedState key

function createScript(valueToEncode) {
  return `
(function () {
  const valueToEncode = ${JSON.stringify(String(valueToEncode))};

  function loadScript(src, callback) {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = callback;
    document.head.appendChild(s);
  }

  loadScript("https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js", function () {
    console.log("QRCode lib loaded");

    const container = document.getElementById("wrapper");

    if (!container) {
      console.error("callbacksPanel not found");
      return;
    }

    const qrDiv = document.createElement("div");
    qrDiv.id = "pairing-qr-code";
    qrDiv.style.textAlign = "center";
    qrDiv.style.width = "100%";
    qrDiv.style.display = "flex";
    qrDiv.style.justifyContent = "center";
    qrDiv.style.alignItems = "center";
    qrDiv.style.margin = "16px 0";

    container.prepend(qrDiv);

    new QRCode(qrDiv, {
      text: valueToEncode
    });
  });
})();
`;
}


var url = `https://api.pingone.com/v1/environments/${envId}/users/${userId}/pairingKeys/${pairingKeyId}`;

if (callbacks.isEmpty()) {
    logger.info("Displaying pairing code to user: " + pairingCode);
    callbacksBuilder.scriptTextOutputCallback(createScript(pairingKey));
    callbacksBuilder.textOutputCallback(0, "Pairing Code: " + pairingCode);
    callbacksBuilder.confirmationCallback(0, ["Paired"], 0);
    
} else {
    logger.error("User has submitted pairing code, checking status...");
    var response = httpClient.send(url, requestOptions).get();
    if (response.status === 200) {
        try {
            var responseJson = JSON.parse(response.json());
        } catch (e) {
            logger.error("Failed to parse JSON: " + e);
        }
        if (responseJson.status === "CLAIMED") {
            logger.info("Device successfully paired.");
            action.goTo("true");
        }
    }
}

