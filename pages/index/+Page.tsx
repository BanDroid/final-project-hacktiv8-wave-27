import { useEffect, useState } from "react";
import ChatInput from "../../components/ChatInput";
import { Chat } from "../../models/Chat";
import ChatList from "../../components/ChatList";

export default function Page() {
  const [chats, setChats] = useState<Chat[]>([]);
  useEffect(() => {
    if (chats.length < 1) {
      const savedChats = localStorage.getItem("chats");
      if (savedChats) setChats(JSON.parse(savedChats));
    } else {
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  }, [chats]);
  return (
    <>
      <div className="h-full flex flex-col items-stretch justify-center">
        <section className="flex-1 p-4 overflow-auto">
          <ChatList chats={chats} setChats={setChats} />
        </section>
        <section className="p-2 bg-base-300">
          <ChatInput chats={chats} setChats={setChats} />
        </section>
      </div>
    </>
  );
}
