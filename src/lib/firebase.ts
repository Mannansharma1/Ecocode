// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// -------------------- AUTH HELPERS --------------------

// 🔹 Email/Password Authentication
export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

// 🔹 Google Authentication (Popup)
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // The signed-in user info:
    const user = result.user;
    return user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

// 🔹 Sign Out
export const signOut = () => firebaseSignOut(auth);

// 🔹 Password Reset
export const sendReset = (email: string) => sendPasswordResetEmail(auth, email);

// 🔹 Update User Profile
export const updateUserProfile = (data: { displayName?: string; photoURL?: string }) =>
  auth.currentUser ? updateProfile(auth.currentUser, data) : Promise.reject("No user");

// -------------------- END --------------------
