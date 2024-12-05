        // data/secrets

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const storage = firebase.storage();
const auth = firebase.auth();
const db = firebase.firestore();
export { storage, auth, db };
