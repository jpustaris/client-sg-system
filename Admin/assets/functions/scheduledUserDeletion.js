const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
exports.deleteOldRejectedUsers = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    const cutoffDate = admin.firestore.Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 7 days ago
    const snapshot = await admin.firestore().collection('rejectedapplicant').where('rejectionTimestamp', '<=', cutoffDate).get();
    if (snapshot.empty) {
        console.log("No old rejected users to delete.");
        return null; 
    }
    const batch = admin.firestore().batch();
    snapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log("Old rejected users deleted.");
});
