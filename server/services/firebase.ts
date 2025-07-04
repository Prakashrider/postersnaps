import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
    // Add service account key if available
    ...(process.env.FIREBASE_SERVICE_ACCOUNT_KEY && {
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
    })
  };

  initializeApp(firebaseConfig);
}

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

export { auth, db, storage };

export async function verifyFirebaseToken(token: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name
    };
  } catch (error) {
    console.error('Firebase token verification error:', error);
    throw new Error('Invalid token');
  }
}

export async function uploadPosterToStorage(imageBuffer: Buffer, filename: string): Promise<string> {
  try {
    const bucket = storage.bucket();
    const file = bucket.file(`posters/${filename}`);
    
    await file.save(imageBuffer, {
      metadata: {
        contentType: 'image/png'
      }
    });
    
    // Make file publicly accessible
    await file.makePublic();
    
    return `https://storage.googleapis.com/${bucket.name}/posters/${filename}`;
  } catch (error) {
    console.error('Storage upload error:', error);
    throw new Error('Failed to upload poster');
  }
}
