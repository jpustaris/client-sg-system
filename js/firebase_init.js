import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js"; // Add getDocs, query, where
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwZg1CODurIz0uJRiMxus28eKSd2CTHi4",
  authDomain: "lefmogiv-f49b3.firebaseapp.com",
  projectId: "lefmogiv-f49b3",
  storageBucket: "lefmogiv-f49b3.appspot.com",
  messagingSenderId: "687909819475",
  appId: "1:687909819475:web:60699d8e2a96376939e2a6",
  measurementId: "G-C7YD21Q71Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export all required functions and instances
export { auth, db, storage, addDoc, collection, ref, uploadBytes, getDownloadURL, getFirestore, getStorage, getDocs, query, where };
