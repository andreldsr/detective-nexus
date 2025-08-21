
"use client";

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "./firebase";

export async function signUp(email: string, pass: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  } catch (error: any) {
    // Provide more specific error messages
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('This email address is already in use.');
      case 'auth/invalid-email':
        throw new Error('The email address is not valid.');
      case 'auth/weak-password':
        throw new Error('The password is too weak.');
      default:
        throw new Error('An unknown error occurred during sign up.');
    }
  }
}

export async function signIn(email: string, pass: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  } catch (error: any) {
     // Provide more specific error messages
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        throw new Error('Invalid email or password.');
      case 'auth/invalid-email':
        throw new Error('The email address is not valid.');
      default:
        throw new Error('An unknown error occurred during sign in.');
    }
  }
}

export async function signOutUser() {
    try {
        await signOut(auth);
    } catch(error: any) {
        console.error("Error signing out: ", error);
        throw new Error("Failed to sign out.");
    }
}
