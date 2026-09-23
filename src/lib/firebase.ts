// Firebase client SDK bootstrap. Safe to import anywhere (server or client):
// when NEXT_PUBLIC_FIREBASE_* env vars are absent, `isFirebaseConfigured` is
// false and the getters below return `undefined` instead of throwing, so
// callers can fall back to local seed data / no-op behavior.
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore as getFirestoreSdk, type Firestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth as getAuthSdk, type Auth } from "firebase/auth";

/** Local-dev-only escape hatch: when set, points Firestore/Auth at the
 * `firebase emulators:start` suite instead of the real project, so local
 * testing never touches production data. Never set in deployed environments. */
const USE_EMULATORS = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

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
let dbEmulatorConnected = false;
let authEmulatorConnected = false;

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
  if (USE_EMULATORS && !dbEmulatorConnected) {
    connectFirestoreEmulator(dbSingleton, "127.0.0.1", 8080);
    dbEmulatorConnected = true;
  }
  return dbSingleton;
}

/** Returns the Auth instance, or undefined when Firebase isn't configured. */
export function getFirebaseAuth(): Auth | undefined {
  const a = getFirebaseApp();
  if (!a) return undefined;
  if (!authSingleton) authSingleton = getAuthSdk(a);
  if (USE_EMULATORS && !authEmulatorConnected) {
    connectAuthEmulator(authSingleton, "http://127.0.0.1:9099", { disableWarnings: true });
    authEmulatorConnected = true;
  }
  return authSingleton;
}
