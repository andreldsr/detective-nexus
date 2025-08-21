
"use client";

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export async function signUp(email: string, pass: string, displayName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName });
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

export async function signInWithGoogle() {
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        return userCredential.user;
    } catch(error: any) {
        // Handle specific popup errors
        switch (error.code) {
            case 'auth/popup-closed-by-user':
              // This is a common case, we can choose to do nothing or log it
              console.log('Google sign-in popup closed by user.');
              return null; // Don't throw an error, just return null
            case 'auth/account-exists-with-different-credential':
              throw new Error('An account already exists with the same email address but different sign-in credentials.');
            default:
              console.error("Error during Google sign-in: ", error);
              throw new Error("An unknown error occurred during Google sign-in.");
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
