import { auth } from "../lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";
import {
  increment,
  writeBatch,
  doc,
  getFirestore,
} from "firebase/firestore";
import { HeartOutlined, HeartTwoTone } from "@ant-design/icons";
import { useContext } from "react";
import { UserContext } from "../lib/context";

// Allows user to heart or like a post
export default function Heart({ postRef }: any) {
  const { user }: any = useContext(UserContext);
  const test = auth.currentUser?.uid || "dummy";
  // Listen to heart document for currently logged in user
  const heartRef = doc(getFirestore(), postRef.path, "hearts", test);
  const [heartDoc] = useDocument(heartRef);

  // Create a user-to-post relationship
  const addHeart = async () => {
    if(heartRef.id == "dummy"){
      return
    } else {
    const uid = auth.currentUser?.uid;
    const batch = writeBatch(getFirestore());

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
    }
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    const batch = writeBatch(getFirestore());

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return heartDoc?.exists() ? (
      <HeartTwoTone style={{ fontSize: '1.5em' }} twoToneColor="#eb2f96" onClick={removeHeart}/>
  ) : (
      <HeartOutlined style={{ fontSize: '1.5em', color: 'gray' }} onClick={addHeart}/>
  );
}
