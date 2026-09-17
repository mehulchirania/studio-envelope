// Firebase client SDK bootstrap. Safe to import anywhere (server or client):
// when NEXT_PUBLIC_FIREBASE_* env vars are absent, `isFirebaseConfigured` is
// false and the getters below return `undefined` instead of throwing, so
// callers can fall back to local seed data / no-op behavior.
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore as getFirestoreSdk, type Firestore } from "firebase/firestore";
import { getAuth as getAuthSdk, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // Optional: this project doesn't use Firebase Storage (images live in
  // Vercel Blob instead), but the field is harmless to keep set if present.
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True when the minimum set of public Firebase env vars is present. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app: FirebaseApp | undefined;
let dbSingleton: Firestore | undefined;
let authSingleton: Auth | undefined;

function getFirebaseApp(): FirebaseApp | undefined {
  if (!isFirebaseConfigured) return undefined;
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

/** Returns the Firestore instance, or undefined when Firebase isn't configured. */
export function getDb(): Firestore | undefined {
  const a = getFirebaseApp();
  if (!a) return undefined;
  if (!dbSingleton) dbSingleton = getFirestoreSdk(a);
  return dbSingleton;
}

/** Returns the Auth instance, or undefined when Firebase isn't configured. */
export function getFirebaseAuth(): Auth | undefined {
  const a = getFirebaseApp();
  if (!a) return undefined;
  if (!authSingleton) authSingleton = getAuthSdk(a);
  return authSingleton;
}
