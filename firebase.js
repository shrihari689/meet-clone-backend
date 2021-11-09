const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const { getDatabase } = require("firebase-admin/database");
const serviceAccount = require("./serviceAccountKey.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://meet-clone-shrihari689-default-rtdb.asia-southeast1.firebasedatabase.app",
});

module.exports.auth = getAuth(app);
module.exports.database = getDatabase(app);
