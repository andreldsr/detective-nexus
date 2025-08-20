
import { db } from '../src/lib/firebase-admin';
import { caseData } from '../src/lib/data';
import { CaseDataSchema } from '../src/lib/types';

async function uploadCase() {
  try {
    console.log('Validating case data...');
    const parsedData = CaseDataSchema.parse(caseData);
    
    const caseId = 'case-1';
    console.log(`Uploading case "${parsedData.title}" with ID: ${caseId}`);
    
    const caseDocRef = db.collection('cases').doc(caseId);
    await caseDocRef.set(parsedData);

    console.log('Case data uploaded successfully!');
    console.log(`Access it in your app by fetching the document from "cases/${caseId}".`);
    process.exit(0);
  } catch (error) {
    console.error('Error uploading case data:', error);
    process.exit(1);
  }
}

uploadCase();

