// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// import { getAnalytics } from "firebase/analytics";
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
  measurementId: "G-TQLQK7C74K",
};
export const ikfpkbDB = () => {
  const ikfpkbFirebaseConfig = {
    apiKey: "AIzaSyB4KkX-lY3mRmERgn6a0OEICQ6VYQ-PkhA",
    authDomain: "ikfpkb-midwest.firebaseapp.com",
    projectId: "ikfpkb-midwest",
    storageBucket: "ikfpkb-midwest.appspot.com",
    messagingSenderId: "719658046582",
    appId: "1:719658046582:web:d3734ab36d1dc0f19f3b57",
    measurementId: "G-JLH3W3TEJ",
    databaseURL: "https://ikfpkb-midwest.firebaseio.com",
  };
  const app = initializeApp(ikfpkbFirebaseConfig);
  const ikfpkbDB = getDatabase(app);
  return ikfpkbDB;
};
