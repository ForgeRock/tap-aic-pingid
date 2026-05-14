if (callbacks.isEmpty()) {
    callbacksBuilder.textInputCallback("Enter OTP from the PingID app");
} else {
    var otp = callbacks.getTextInputCallbacks().get(0);

    if (otp === null || !otp) {
        nodeState.putShared("otpError", "OTP was not provided");
        action.goTo("error");
    } else {
        nodeState.putShared("otp", otp);
        action.goTo("submitted");
    }
}
