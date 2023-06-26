// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDMBwlnhNUmDlV9rEct_tkgxRhJvEasAA",
  authDomain: "combatstats-b6c26.firebaseapp.com",
  projectId: "combatstats-b6c26",
  storageBucket: "combatstats-b6c26.appspot.com",
  messagingSenderId: "94594949326",
  appId: "1:94594949326:web:d51372d8774d1336dff09f",
  measurementId: "G-TQLQK7C74K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db }