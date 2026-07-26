const { getMessaging } = require("firebase-admin/messaging");
require("../../config/firebase");

async function sendPushNotification(fcmToken, title, body) {
  if (!fcmToken) return;
  try {
    await getMessaging().send({
      token: fcmToken,
      notification: { title, body },
    });
    console.log("push sent:", title);
  } catch (err) {
    console.log("push failed:", err.message);
  }
}

module.exports = { sendPushNotification };
