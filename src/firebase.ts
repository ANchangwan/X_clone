import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDY7rZ8gi9XBMwzp3v7neNE9NRKFESdhDA",
  authDomain: "x-reloaded-94b78.firebaseapp.com",
  projectId: "x-reloaded-94b78",
  storageBucket: "x-reloaded-94b78.appspot.com",
  messagingSenderId: "349121080161",
  appId: "1:349121080161:web:7275e444df68fca2787320",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
