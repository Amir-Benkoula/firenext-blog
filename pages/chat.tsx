import AuthCheck from "../components/AuthCheck";
import {
  addDoc,
  collection,
  limitToLast,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../lib/firebase";

export default function ChatPage() {
  return (
    <AuthCheck>
      <div className="App">
        <header>
          <h1>⚛️🔥💬</h1>
        </header>

        <ChatRoom />
      </div>
    </AuthCheck>
  );
}

function ChatMessage(props: any) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser?.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} />
        <p>{text}</p>
      </div>
    </>
  );
}


function ChatRoom() {
  const [formValue, setFormValue] = useState("");
  const messagesRef = collection(firestore, "messages");
  const messageQuery = query(
    messagesRef,
    orderBy("createdAt"),
    limitToLast(25)
  );

  const [messages] = useCollectionData(messageQuery);

  const sendMessage = async (e: any) => {
    e.preventDefault();

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid: auth.currentUser?.uid,
      photoURL: auth.currentUser?.photoURL,
    });

    setFormValue("");
  };

  return (
    <main>
      {messages &&
        messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </main>
  );
}
