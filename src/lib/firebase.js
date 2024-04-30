// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatwebapplication-6588c.firebaseapp.com",
  projectId: "chatwebapplication-6588c",
  storageBucket: "chatwebapplication-6588c.appspot.com",
  messagingSenderId: "841604112367",
  appId: "1:841604112367:web:fbbbecb5defc33563e201a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
