import firebase from 'firebase/app';
import { Timestamp } from 'firebase/firestore';
import { initializeApp, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, DocumentData, limit, QueryDocumentSnapshot} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAKRXuc7vnQ3uPzYyEXTk0ljRUdDOMsP1U",
    authDomain: "firenext-app-18b5d.firebaseapp.com",
    projectId: "firenext-app-18b5d",
    storageBucket: "firenext-app-18b5d.appspot.com",
    messagingSenderId: "623728570275",
    appId: "1:623728570275:web:914e61cab7b9ec35073416",
    measurementId: "G-PL9D4SYRE1"
  };

function createFirebaseApp(config: any) {
    try {
      return getApp();
    } catch {
      return initializeApp(config);
    }
  }

// Create App
const firebaseApp = createFirebaseApp(firebaseConfig);

// Auth exports
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// Firestore exports
export const firestore = getFirestore(firebaseApp);
export const fromMillis = Timestamp.fromMillis;
export const toMillis = Timestamp.prototype.toMillis;

// Storage exports
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = 'state_changed';

// /// Helper functions

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
 export async function getUserWithUsername(username: string) {
  const usersRefQuery = query(collection(firestore, "users"), where("username", "==", username), limit(1));
  const userDoc = (await getDocs(usersRefQuery)).docs[0];

  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {QueryDocumentSnapshot<DocumentData>} doc
 */
 export function postToJSON(doc: DocumentData) {
  const docData = doc.data();
  return {
    ...docData,
    createdAt: docData.createdAt.toMillis(),
    updatedAt: docData.updatedAt.toMillis(),
  };
}

