// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDBcy0uAVjrTqykSw9fNswmuuktxywCSyM",
  authDomain: "applibit-28066.firebaseapp.com",
  projectId: "applibit-28066",
  storageBucket: "applibit-28066.firebasestorage.app",
  messagingSenderId: "787697335155",
  appId: "1:787697335155:web:94e4658593b2d44ad56306",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
