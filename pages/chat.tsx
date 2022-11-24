import AuthCheck from "../components/AuthCheck";
import ChatRoom from "../components/ChatRoom";

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
