
'use server';

import { db } from './firebase-admin';
import type { UserData } from './types';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

async function getCurrentUserId(): Promise<string | null> {
    try {
        const cookieStore = cookies();
        const idToken = cookieStore.get('firebaseIdToken')?.value;
        if (!idToken) return null;
        const decodedToken = await getAuth().verifyIdToken(idToken);
        return decodedToken.uid;
    } catch (error) {
        console.error("Error verifying ID token:", error);
        return null;
    }
}


export async function createDbUser(uid: string, name: string, email: string): Promise<UserData> {
    const userRef = db.collection('users').doc(uid);
    const newUser: UserData = {
        uid,
        name,
        email,
        caseProgress: {},
    };
    await userRef.set(newUser);
    return newUser;
}

export async function getDbUser(uid: string): Promise<UserData | null> {
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();
    if (userSnap.exists) {
        return userSnap.data() as UserData;
    }
    return null;
}

export async function getCaseProgress(caseId: string): Promise<string[] | null> {
    const userId = await getCurrentUserId();
    if (!userId) {
        return null;
    }

    const user = await getDbUser(userId);
    return user?.caseProgress[caseId]?.unlockedClueIds ?? null;
}


export async function updateCaseProgress(caseId: string, unlockedClueIds: string[]): Promise<void> {
    const userId = await getCurrentUserId();
    if (!userId) {
        console.error("User not logged in, cannot update progress.");
        return;
    }
    console.log(userId);
    const userRef = db.collection('users').doc(userId);

    const progressToSave = {
        caseProgress: {
            [caseId]: {
                unlockedClueIds: unlockedClueIds
            }
        }
    };
    
    // Use set with merge: true to create the document/nested fields if they don't exist
    await userRef.set(progressToSave, { merge: true });
}
