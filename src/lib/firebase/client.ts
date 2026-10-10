// Firebase client SDK bootstrap for public reads and the contact form. Safe to
// import anywhere (server or client): when NEXT_PUBLIC_FIREBASE_* env vars are
// absent, `isFirebaseConfigured` is false and `getDb()` returns `undefined`
// instead of throwing, so callers can fall back to local seed data.
// Admin writes do not use this file; see src/lib/firebase/admin-server.ts.
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore as getFirestoreSdk, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

/** Local-dev-only escape hatch: when set, points Firestore at the
 * `firebase emulators:start` suite instead of the real project, so local
 * testing never touches production data. Never set in deployed environments. */
export const USE_EMULATORS = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
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
let dbEmulatorConnected = false;

function getFirebaseApp(): FirebaseApp | undefined {
  if (!isFirebaseConfigured) return undefined;
  if (!app) {
    // Look up the default app by name: the server also holds a separate
    // "admin-service" app, so getApps().length alone isn't enough.
    app = getApps().find((a) => a.name === "[DEFAULT]") ?? initializeApp(firebaseConfig);
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

let authSingleton: Auth | undefined;

/** Returns the client Auth instance, or undefined when Firebase isn't configured. */
export function getFirebaseAuth(): Auth | undefined {
  const a = getFirebaseApp();
  if (!a) return undefined;
  if (!authSingleton) authSingleton = getAuth(a);
  return authSingleton;
}

