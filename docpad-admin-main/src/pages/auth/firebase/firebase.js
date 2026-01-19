// firebase.js - DocPad EMR Auth Service
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

// ======================
// 🔐 Firebase Configuration (Doctor Project)
// ======================
const firebaseConfig = {
  apiKey: "AIzaSyCglBH_hGjl7kJgEBMCBfNoo2yoMhVnpS4",
  authDomain: "docpad-f4049.firebaseapp.com",
  projectId: "docpad-f4049",
  storageBucket: "docpad-f4049.firebasestorage.app",
  messagingSenderId: "645305219726",
  appId: "1:645305219726:web:39f17ffbc1818da5f427df",
  measurementId: "G-TF66J7DY2N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ======================
// 🔐 Auth & Google Provider
// ======================
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});

// ======================
// LOGIN WITH GOOGLE
// ======================
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      name: result.user.displayName,
      email: result.user.email,
      avatar: result.user.photoURL,
      uid: result.user.uid,
      role: "doctor" // you can change or fetch from backend later
    };
  } catch (err) {
    console.error("Google Login Error:", err);
    throw err;
  }
};

// ======================
// LOGOUT
// ======================
export const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (err) {
    console.error("Firebase Logout Failed:", err);
    throw err;
  }
};

// ======================
// AUTH STATE LISTENER (Use for auto login state)
// ======================
export const onAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};
