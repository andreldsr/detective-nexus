
'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { db } from './firebase-admin';
import type { CaseData } from './types';
import { CaseDataSchema } from './types';

// Simple in-memory TTL cache (per server instance)
const globalAny = global as unknown as { __CASE_CACHE__?: Map<string, { value: any; expiresAt: number }> };
const cache: Map<string, { value: any; expiresAt: number }> = globalAny.__CASE_CACHE__ || new Map();
if (!globalAny.__CASE_CACHE__) {
  globalAny.__CASE_CACHE__ = cache;
}

const TTL_MS = 60 * 1000; // 60 seconds

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value as T;
}

function setInCache<T>(key: string, value: T): void {
  cache.set(key, { value, expiresAt: Date.now() + TTL_MS });
}

export async function getCase(caseId: string): Promise<{ caseData: CaseData | null; error: string | null }> {
  const cacheKey = `case:${caseId}`;
  const cached = getFromCache<{ caseData: CaseData | null; error: string | null }>(cacheKey);
  if (cached) return cached;

  try {
    const caseDocRef = db.collection('cases').doc(caseId);
    const caseDocSnap = await caseDocRef.get();

    if (!caseDocSnap.exists) {
      console.error('No such document!');
      const result = { caseData: null, error: `Case with id "${caseId}" not found.` } as const;
      setInCache(cacheKey, result);
      return result;
    }

    const data = caseDocSnap.data();
    const parsedData = CaseDataSchema.safeParse(data);

    if (!parsedData.success) {
        console.error('Failed to parse case data:', parsedData.error.flatten());
        const result = { caseData: null, error: `Failed to validate case data from Firestore. ${parsedData.error.message}` } as const;
        setInCache(cacheKey, result);
        return result;
    }
    
    // IMPORTANT: Do not generate images here. It's too slow and causes timeouts.
    // The placeholder URLs from data.ts will be used instead.
    
    const result = { caseData: parsedData.data, error: null } as const;
    setInCache(cacheKey, result);
    return result;
  } catch (e: any) {
    console.error("Error getting document:", e);
    const result = { caseData: null, error: e.message } as const;
    setInCache(cacheKey, result);
    return result;
  }
}


export async function listCases(): Promise<{ cases: (Pick<CaseData, 'title' | 'description' | 'difficulty'> & { id: string })[] | null; error: string | null; }> {
    const cacheKey = 'cases:list';
    const cached = getFromCache<{ cases: (Pick<CaseData, 'title' | 'description' | 'difficulty'> & { id: string })[] | null; error: string | null }>(cacheKey);
    if (cached) return cached;

    try {
        const casesCollection = db.collection('cases');
        const snapshot = await casesCollection.get();

        if (snapshot.empty) {
            const result = { cases: [], error: null } as const;
            setInCache(cacheKey, result);
            return result;
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

        const result = { cases, error: null } as const;
        setInCache(cacheKey, result);
        return result;

    } catch (e: any) {
        console.error("Error listing documents:", e);
        const result = { cases: null, error: e.message } as const;
        setInCache(cacheKey, result);
        return result;
    }
}
