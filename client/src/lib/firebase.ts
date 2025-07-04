import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError, onAuthStateChanged, User } from "firebase/auth";
import { useState, useEffect } from "react";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX",
};

// Check if Firebase is properly configured
const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
                             import.meta.env.VITE_FIREBASE_PROJECT_ID;

let auth: any = null;
let provider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
}

export { auth, provider, isFirebaseConfigured };

export function useAuthState(): [User | null, boolean] {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  return [user, loading];
}

export function signUpWithEmail(email: string, password: string) {
  if (!auth) {
    console.warn('Firebase not configured. Using mock authentication.');
    return Promise.reject(new Error('Firebase not configured'));
  }
  return createUserWithEmailAndPassword(auth, email, password);
}

export function signInWithEmail(email: string, password: string) {
  if (!auth) {
    console.warn('Firebase not configured. Using mock authentication.');
    return Promise.reject(new Error('Firebase not configured'));
  }
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle() {
  if (!auth || !provider) {
    console.warn('Firebase not configured. Using mock authentication.');
    return Promise.reject(new Error('Firebase not configured'));
  }
  
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error: any) {
    console.warn('Google sign-in popup failed:', error);
    // If popup fails due to CORS or other issues, user can try email auth
    throw error;
  }
}

export function signOut() {
  if (!auth) {
    console.warn('Firebase not configured. Using mock authentication.');
    return Promise.resolve();
  }
  return auth.signOut();
}
