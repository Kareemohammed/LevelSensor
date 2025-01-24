const {onRequest} = require("firebase-functions/v2/https");
const {onUpdate} = require("firebase-functions/v2/database");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Cloud Function to send notifications when distance exceeds 15 mm
exports.sendNotificationOnThreshold = onUpdate("/sensor/distance", async (change, context) => {
  const before = change.before.val();
  const after = change.after.val();

  // Check if the distance has exceeded 15 mm
  if (after > 15 && before <= 15) {
    const payload = {
      notification: {
        title: "Alert!",
        body: "The distance has crossed 15 mm.",
        sound: "default", // Customize the sound if needed
      },
    };

    // Retrieve user tokens from your database
    const tokens = await getUserTokens();

    if (tokens.length > 0) {
      // Send notifications to the user tokens
      return admin.messaging().sendToDevice(tokens, payload)
          .then((response) => {
            logger.info("Notifications sent successfully:", response);
            return null;
          })
          .catch((error) => {
            logger.error("Error sending notification:", error);
            return null;
          });
    } else {
      logger.info("No tokens available to send notifications.");
      return null;
    }
  } else {
    return null; // No notification needed
  }
});

// Function to retrieve user tokens from your database
const getUserTokens = async () => {
  const snapshot = await admin.database().ref("/users").once("value");
  const tokens = [];
  snapshot.forEach((childSnapshot) => {
    const token = childSnapshot.val().token;
    if (token) {
      tokens.push(token);
    }
  });
  return tokens;
};

// Optional: Hello World function (commented out for now)
exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
