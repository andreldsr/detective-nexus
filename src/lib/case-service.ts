
'use server';

import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase-admin';
import type { CaseData } from './types';
import { CaseDataSchema } from './types';

export async function getCase(caseId: string): Promise<{ caseData: CaseData | null; error: string | null }> {
  try {
    const caseDocRef = doc(db, 'cases', caseId);
    const caseDocSnap = await getDoc(caseDocRef);

    if (!caseDocSnap.exists()) {
      console.error('No such document!');
      return { caseData: null, error: `Case with id "${caseId}" not found.` };
    }

    const data = caseDocSnap.data();
    const parsedData = CaseDataSchema.safeParse(data);

    if (!parsedData.success) {
        console.error('Failed to parse case data:', parsedData.error.flatten());
        return { caseData: null, error: `Failed to validate case data from Firestore. ${parsedData.error.message}` };
    }
    
    return { caseData: parsedData.data, error: null };
  } catch (e: any) {
    console.error("Error getting document:", e);
    return { caseData: null, error: e.message };
  }
}
