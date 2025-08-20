
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: serviceAccount ? admin.credential.cert(serviceAccount) : undefined,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'detective-nexus',
  });
}

const db = getFirestore();

export { admin, db };
