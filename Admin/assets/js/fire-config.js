var firebaseConfig = {
    apiKey: "AIzaSyAwZg1CODurIz0uJRiMxus28eKSd2CTHi4",
    authDomain: "lefmogiv-f49b3.firebaseapp.com",
    projectId: "lefmogiv-f49b3",
    storageBucket: "lefmogiv-f49b3.appspot.com",
    messagingSenderId: "687909819475",
    appId: "1:687909819475:web:60699d8e2a96376939e2a6",
    measurementId: "G-C7YD21Q71Y"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const storage = firebase.storage();
const auth = firebase.auth();
const db = firebase.firestore();
export { storage, auth, db };
