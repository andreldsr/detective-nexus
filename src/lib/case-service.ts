
'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { db } from './firebase-admin';
import type { CaseData } from './types';
import { CaseDataSchema } from './types';

export async function getCase(caseId: string): Promise<{ caseData: CaseData | null; error: string | null }> {
  try {
    const caseDocRef = db.collection('cases').doc(caseId);
    const caseDocSnap = await caseDocRef.get();

    if (!caseDocSnap.exists) {
      console.error('No such document!');
      return { caseData: null, error: `Case with id "${caseId}" not found.` };
    }

    const data = caseDocSnap.data();
    const parsedData = CaseDataSchema.safeParse(data);

    if (!parsedData.success) {
        console.error('Failed to parse case data:', parsedData.error.flatten());
        return { caseData: null, error: `Failed to validate case data from Firestore. ${parsedData.error.message}` };
    }
    
    // IMPORTANT: Do not generate images here. It's too slow and causes timeouts.
    // The placeholder URLs from data.ts will be used instead.
    
    return { caseData: parsedData.data, error: null };
  } catch (e: any) {
    console.error("Error getting document:", e);
    return { caseData: null, error: e.message };
  }
}


export async function listCases(): Promise<{ cases: (Pick<CaseData, 'title' | 'description' | 'difficulty'> & { id: string })[] | null; error: string | null; }> {
    try {
        const casesCollection = db.collection('cases');
        const snapshot = await casesCollection.get();

        if (snapshot.empty) {
            return { cases: [], error: null };
        }

        const cases = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title ?? 'Untitled Case',
                description: data.description ?? 'No description.',
                difficulty: data.difficulty ?? 'Unknown',
            };
        });

        return { cases, error: null };

    } catch (e: any) {
        console.error("Error listing documents:", e);
        return { cases: null, error: e.message };
    }
}
