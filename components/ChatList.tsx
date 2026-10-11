import { Chat } from "../models/Chat";
import { Dispatch, SetStateAction } from "react";

export default function ChatList({
  chats,
  setChats,
}: {
  chats: Chat[];
  setChats: Dispatch<SetStateAction<Chat[]>>;
}) {
  return (
    <ul className="space-y-2">
      {chats.map((chat) => (
        <li
          key={chat.id}
          className={`chat ${chat.isUser ? "chat-end" : "chat-start"}`}
        >
          <div className="chat-image avatar">
            <div className="size-10 p-2 rounded-lg bg-base-300">
              {chat.isUser ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              ) : (
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-full fill-base-content"
                >
                  <title>Probot</title>
                  <path d="M12 .04a1.743 1.743 0 0 0-.537 3.401l-.631 2.579H2.456A2.456 2.456 0 0 0 0 8.476v13.029a2.456 2.456 0 0 0 2.456 2.456h19.088c1.356 0 2.456-1.1 2.456-2.456V8.476c0-1.356-1.1-2.456-2.456-2.456h-8.403l-.616-2.575A1.743 1.743 0 0 0 11.999.04zM3.933 7.881h16.136c1.101 0 1.994.893 1.994 1.994v10.117a1.994 1.994 0 0 1-1.994 1.994H3.933a1.994 1.994 0 0 1-1.994-1.994V9.875c0-1.101.893-1.994 1.994-1.994zm3.254 2.312a4.575 4.575 0 1 0 0 9.15 4.575 4.575 0 0 0 0-9.15zm9.743 0a4.575 4.575 0 1 0 0 9.15 4.575 4.575 0 0 0 0-9.15zm-9.743 1.07a3.506 3.506 0 1 1 0 7.011 3.506 3.506 0 0 1 0-7.011zm9.743 0a3.506 3.506 0 1 1 0 7.011 3.506 3.506 0 0 1 0-7.011zm-9.743 1.663a1.843 1.843 0 1 0 0 3.686 1.843 1.843 0 0 0 0-3.686zm9.743 0a1.843 1.843 0 1 0 0 3.686 1.843 1.843 0 0 0 0-3.686zm-6.927 6.5v2.159h.706v-2.159h-.706zm1.077 0v2.159h.705v-2.159h-.705zm1.076 0v2.159h.706v-2.159h-.706zm1.077 0v2.159h.706v-2.159h-.706zm1.077.03v2.1a1.08 1.08 0 0 0 .829-1.049v-.001c0-.51-.354-.937-.829-1.05zm-4.678.028a1.08 1.08 0 0 0-.731 1.021v.001c0 .474.306.876.731 1.021v-2.043z" />
                </svg>
              )}
            </div>
          </div>
          {chat.media && (
            <div className="chat-header">
              {chat.media.filename}{" "}
              <a href={chat.media.uri} target="_blank" className="text-primary">
                Open media
              </a>
            </div>
          )}
          <div
            className={`chat-bubble ${chat.isUser ? "chat-bubble-secondary text-secondary-content" : "chat-bubble-primary text-primary-content"}`}
          >
            {chat.text}
          </div>
        </li>
      ))}
    </ul>
  );
}
