import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, collection, getDoc, collectionGroup, getDocs, query, where, DocumentData, limit, QuerySnapshot, QueryDocumentSnapshot} from "firebase/firestore";
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

// Storage exports
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = 'state_changed';

// /// Helper functions

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
 export async function getUserWithUsername(username: string) {
  const userDoc: Array<DocumentData> = [];
  const usersRefQuery = query(collection(firestore, "users"), where("username", "==", username), limit(1));
  const userDocSnapshot = await getDocs(usersRefQuery);
  userDocSnapshot.forEach((doc) => {
    userDoc.push(doc.data());
  })

  return userDoc[0];
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentData} doc
 */
 export function postToJSON(doc: DocumentData) {
  return {
    ...doc,
    createdAt: doc.createdAt.toMillis(),
    updatedAt: doc.updatedAt.toMillis(),
  };
}
