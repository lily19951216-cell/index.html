/**
 * Firebase 11 雲端實時同步模組
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

export const appId = typeof __app_id !== 'undefined' ? __app_id : 'osaka-travel-app';

// 💡 提示：若要在自有 Firebase 運行，請將下方替換為您在 Firebase 控制台取得的 firebaseConfig
export const firebaseConfig = {
  apiKey: "AIzaSyAg0ufqQhME7tS4OSzUCMYlMGxc56eHojU",
  authDomain: "osaka-ae3bc.firebaseapp.com",
  projectId: "osaka-ae3bc",
  storageBucket: "osaka-ae3bc.firebasestorage.app",
  messagingSenderId: "671578955964",
  appId: "1:671578955964:web:3f12558da41e4d1e21f0b9",
  measurementId: "G-PFZ4SM8SHX"
};

export const fbApp = initializeApp(firebaseConfig);
export const auth = getAuth(fbApp);
export const db = getFirestore(fbApp);

export { doc, setDoc, onSnapshot, signInAnonymously, signInWithCustomToken };
