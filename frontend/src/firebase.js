// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZPrcmIOudnECWvew3vuZVXTE8_F5BntE",
  authDomain: "healthcare-scheduler-e5685.firebaseapp.com",
  projectId: "healthcare-scheduler-e5685",
  storageBucket: "healthcare-scheduler-e5685.firebasestorage.app",
  messagingSenderId: "119299522828",
  appId: "1:119299522828:web:720a9d57ca688e7fa30929"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);