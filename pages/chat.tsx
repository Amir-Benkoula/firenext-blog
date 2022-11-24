import { useContext } from "react";
import AuthCheck from "../components/AuthCheck";
import ChatRoom from "../components/ChatRoom";
import { UserContext } from "../lib/context";


export default function ChatPage() {
    const { user } = useContext(UserContext);
    
    return(
            <AuthCheck>
            <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
      </header>

    <ChatRoom />

    </div>
            </AuthCheck>
    )
}

