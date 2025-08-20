# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Getting Started

To get started, take a look at `src/app/page.tsx`.

## Connecting to Firebase

This application is configured to use Firebase and Firestore to load case data. To run the application locally and connect to your Firestore database, you need to provide service account credentials to the application.

### 1. Generate a Service Account Key
- Go to your [Google Cloud IAM & Admin page](https://console.cloud.google.com/iam-admin/serviceaccounts).
- Select your Firebase project.
- Click on the **"+ CREATE SERVICE ACCOUNT"** button.
- Give the service account a name (e.g., "firebase-admin-sdk") and grant it the **"Editor"** role.
- Click "Done".
- Find the newly created service account in the list, click the three-dot menu under "Actions", and select **"Manage keys"**.
- Click **"ADD KEY"** -> **"Create new key"**.
- Select **"JSON"** as the key type and click **"CREATE"**. A JSON file containing your service account key will be downloaded.

### 2. Set Up Environment Variable
- Create a new file named `.env.local` in the root of your project.
- Open the downloaded JSON key file, and copy its entire content.
- In your `.env.local` file, add the following line, pasting the JSON content as the value:

```
FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", "project_id": "...", ...}'
```

**IMPORTANT**: Make sure the JSON content is enclosed in single quotes and is all on a single line.

### 3. Upload Case Data
Now that your local environment is authenticated, you can upload the initial case data to Firestore by running the following command in your terminal:

```bash
npm run db:upload
```

After completing these steps, you can start the development server (`npm run dev`), and the application should be able to connect to Firestore and load the case data.
