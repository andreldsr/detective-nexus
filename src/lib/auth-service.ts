
"use client";

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useEffect, useState } from "react";
import { createDbUser, getDbUser } from "./user-service";

async function setSession(user: User) {
    const idToken = await user.getIdToken();
    const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken }),
    });
    if (!response.ok) {
        throw new Error('Failed to set session cookie');
    }
}

async function clearSession() {
    await fetch('/api/auth/session', {
        method: 'DELETE',
        credentials: 'include',
    });
}


export async function signUp(email: string, pass: string, displayName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName });
    
    await createDbUser(userCredential.user.uid, displayName, email);
    await setSession(userCredential.user);
    
    return userCredential.user;
  } catch (error: any) {
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
    await setSession(userCredential.user);
    return userCredential.user;
  } catch (error: any) {
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
        const user = userCredential.user;

        if (user) {
            const dbUser = await getDbUser(user.uid);
            if (!dbUser) {
                await createDbUser(user.uid, user.displayName || "Anonymous", user.email!);
            }
            await setSession(user);
        }
        return user;
    } catch(error: any) {
        switch (error.code) {
            case 'auth/popup-closed-by-user':
              console.log('Google sign-in popup closed by user.');
              return null;
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
        await clearSession();
    } catch(error: any) {
        console.error("Error signing out: ", error);
        throw new Error("Failed to sign out.");
    }
}


export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
