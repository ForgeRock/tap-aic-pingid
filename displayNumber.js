/**
 * Created by the Ping Identity Technology Alliance Partner (TAP) team
 *
 * For support, contact Ping Identity Support
 * or email: tap-global@pingidentity.com
 *
 * Version: 1.5
 */

var numberMatched = nodeState.get("numberMatched");
if (callbacks.isEmpty()) {
callbacksBuilder.textOutputCallback(0, "Number: " + numberMatched);
}
action.goTo("true");
