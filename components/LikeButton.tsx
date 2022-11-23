import { auth } from '../lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { increment, writeBatch, doc, getFirestore, collection } from "firebase/firestore";


// Allows user to heart or like a post
export default function Heart({ postRef }: any) {
  // Listen to heart document for currently logged in user
  const heartRef = doc(collection(getFirestore(), 'hearts'), auth.currentUser?.uid);
  const [heartDoc] = useDocument(heartRef);

  // Create a user-to-post relationship
  const addHeart = async () => {
    const uid = auth.currentUser?.uid;
    const batch = writeBatch(getFirestore());

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    const batch = writeBatch(getFirestore());

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return heartDoc?.exists() ? (
    <button onClick={removeHeart}>💔</button>
  ) : (
    <button onClick={addHeart}>💗</button>
  );
}
