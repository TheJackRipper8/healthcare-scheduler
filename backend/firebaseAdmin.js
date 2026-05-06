
// firebaseAdmin.js
// Helps backend by setting up server connection to Firebase using admin rights
// Helps Node/Express communicate to Firebase as trustwrothy

// Imports
import admin from "firebase-admin";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Helps Firebase to trust the backend is trustworthy due to
// serviceAccountKey.json which has the private key
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "serviceAccountKey.json");


let serviceAccount;

// The raw text content of the serviceAccountKey.json
const raw = fs.readFileSync(filePath, "utf8");

// Try and catch handlers useful for debugging issues with authentication

try 
{
  // Attempt to parse raw into JSON into serviceAccount
  serviceAccount = JSON.parse(raw);
  console.log("JSON parsed ok");
} 
catch (err) 
{
  // If error, display error
  console.error("JSON parse failed:", err.message);
  process.exit(1);
}

// Try to initialize admin rights (credentials) using serviceAccount info
try 
{
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized");
} 
// Error if Firebaase could be initialized
catch (err) {
  console.error("Firebase init failed:", err.message);
  process.exit(1);
}

// Makes backend connect to auth and firestore
export const db = admin.firestore();
export const auth = admin.auth();