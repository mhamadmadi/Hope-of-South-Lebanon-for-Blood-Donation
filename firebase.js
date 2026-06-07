import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyDaTkrvM5njHZpvYlch_OQsZtfoDXBxNVo",
    authDomain: "hopeofsouthlebanon.firebaseapp.com",
    projectId: "hopeofsouthlebanon",
    storageBucket: "hopeofsouthlebanon.firebasestorage.app",
    messagingSenderId: "193304593001",
    appId: "1:193304593001:web:8f8a7fc47c2d4f177018f8",
    measurementId: "G-QKLGNPXL9W"
  };

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)