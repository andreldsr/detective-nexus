
import admin, { type AppOptions } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (!admin.apps.length) {
    const options: AppOptions = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'detective-nexus',
    };

    if(serviceAccount) {
        options.credential = admin.credential.cert(serviceAccount)
    }

  admin.initializeApp(options);
}

const db = getFirestore();

export { admin, db };
