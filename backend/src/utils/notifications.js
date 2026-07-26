const admin = require("../../config/firebase");

async function sendPushNotification(fcmToken, title, body) {
  if (!fcmToken) return;
  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
    });
    console.log("push sent:", title);
  } catch (err) {
    console.log("push failed:", err.message);
  }
}

module.exports = { sendPushNotification };
