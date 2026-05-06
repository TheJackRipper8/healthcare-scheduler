// Import the functions you need from the SDKs you need
// Authentication, firestore, and app setup
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// In other words, assists the frontend in connecting to which Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyCZPrcmIOudnECWvew3vuZVXTE8_F5BntE",
  authDomain: "healthcare-scheduler-e5685.firebaseapp.com",
  projectId: "healthcare-scheduler-e5685",
  storageBucket: "healthcare-scheduler-e5685.firebasestorage.app",
  messagingSenderId: "119299522828",
  appId: "1:119299522828:web:720a9d57ca688e7fa30929"
};

// Initialize Firebase app instance
const app = initializeApp(firebaseConfig);
// Initialize Firebase database
export const db = getFirestore(app);
// Initialize Firebase authentication
export const auth = getAuth(app);