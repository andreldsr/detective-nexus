
'use server';

import { db } from './firebase-admin';
import type { UserData } from './types';



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

export async function getCaseProgress(caseId: string, currentUserId: string): Promise<string[] | null> {
    const user = await getDbUser(currentUserId);
    return user?.caseProgress[caseId]?.unlockedClueIds ?? null;
}


export async function updateCaseProgress(caseId: string, unlockedClueIds: string[], currentUserId: string): Promise<void> {
    try {
        console.log("User ID:", currentUserId);
        
        const userRef = db.collection('users').doc(currentUserId);
        const progressToSave = {
            caseProgress: {
                [caseId]: {
                    unlockedClueIds: unlockedClueIds
                }
            }
        };
        
        await userRef.set(progressToSave, { merge: true });
        console.log("Progress saved successfully for case:", caseId);
    } catch (error) {
        console.error("Error in updateCaseProgress:", error);
        throw error; // Re-throw to be caught by the caller
    }
}
