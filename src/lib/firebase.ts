
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "detective-nexus",
  appId: "1:273239577220:web:7fc8fafb94fbc3a48c68d1",
  storageBucket: "detective-nexus.firebasestorage.app",
  apiKey: "AIzaSyCvT8Z4vQjhIH8TR1ZIFe18wJ8dKvnlxWE",
  authDomain: "detective-nexus.firebaseapp.com",
  messagingSenderId: "273239577220",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
