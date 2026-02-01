// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXjlucA5GYfbEP94PWf49zXLNtvsqR5yk",
  authDomain: "myartworld-aa6b3.firebaseapp.com",
  projectId: "myartworld-aa6b3",
  storageBucket: "myartworld-aa6b3.appspot.com",
  messagingSenderId: "703706744884",
  appId: "1:703706744884:web:7db901b40c0d6597126261"
};

import { getAuth } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service and storage service
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
