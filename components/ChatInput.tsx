import { SetStateAction, useRef, useState, Dispatch } from "react";
import { Chat } from "../models/Chat";
import { callApi } from "../lib/api";
import { detectMediaType } from "../utils/detect-media";
import { Response } from "../models/Response";

export default function ChatInput({
  chats,
  setChats,
}: {
  chats: Chat[];
  setChats: Dispatch<SetStateAction<Chat[]>>;
}) {
  const fileIcons = {
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6"
      >
        <path
          fillRule="evenodd"
          d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    video: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6"
      >
        <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
      </svg>
    ),
    audio: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6"
      >
        <path
          fillRule="evenodd"
          d="M19.952 1.651a.75.75 0 0 1 .298.599V16.303a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.403-4.909l2.311-.66a1.5 1.5 0 0 0 1.088-1.442V6.994l-9 2.572v9.737a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.402-4.909l2.31-.66a1.5 1.5 0 0 0 1.088-1.442V5.25a.75.75 0 0 1 .544-.721l10.5-3a.75.75 0 0 1 .658.122Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    document: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6"
      >
        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
      </svg>
    ),
  };

  const [prompt, setPrompt] = useState<string>("");
  const [file, setFile] = useState<File | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    interaction_id: string | undefined;
  } | null>(null);

  const onSubmit:
    | React.SubmitEventHandler<HTMLFormElement>
    | undefined = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const userNewChat: Chat = {
        id: new Date().getTime().toString(),
        text: prompt.trim(),
        isUser: true,
      };
      const file = fileInputRef.current?.files?.[0];
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("apiKey", localStorage.getItem("apiKey") || "");
      formData.append("model", localStorage.getItem("model") || "");
      formData.append(
        "systemInstruction",
        localStorage.getItem("systemInstruction") || "",
      );
      if (chats.findLast((chat) => !chat.isUser))
        formData.append(
          "previousInteractionId",
          chats.findLast((chat) => !chat.isUser)!.id,
        );
      if (file) {
        const mediaType = detectMediaType(file);
        formData.append("file", file);
        formData.append("mediaType", mediaType);
        formData.append("mimetype", file.type);

        userNewChat["media"] = {
          filename: file.name,
          type: mediaType,
          uri: URL.createObjectURL(file),
        };
      }

      setChats((prev) => [...prev, userNewChat]);
      const result = await callApi<Response>("/api/generate-output", {
        method: "POST",
        body: formData,
      });

      if (!result.success) {
        setError({
          message: result.output,
          interaction_id: userNewChat.id,
        });
        throw new Error(result.output);
      }
      // if prompt success, then interaction_id always exist
      setChats((prev) => [
        ...prev,
        {
          id: result.interactionId!,
          text: result.output,
          isUser: false,
        },
      ]);
      setPrompt("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-2">
        {/* <div className="flex items-center justify-between gap-2 pb-2">
          <span className="bg-accent rounded-lg px-4 py-2">
            {fileIcons["image"]}
          </span>
          <span className="flex-1 line-clamp-2">admin-ngawi.jpg</span>
          <button className="btn btn-ghost btn-sm btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div> */}

        <div className="flex items-center justify-between gap-2">
          <input
            type="file"
            className="file-input file-input-md file-input-primary w-full"
            onChange={(e) => setFile(e.target.files?.[0])}
            ref={fileInputRef}
          />
          {file && (
            <button
              className="btn btn-ghost btn-sm btn-circle"
              type="button"
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.value = "";
                setFile(undefined);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* <div className="dropdown dropdown-top">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-primary btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
            <ul
              tabIndex={-1}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                <a>Image</a>
              </li>
              <li>
                <a>Video</a>
              </li>
              <li>
                <a>Audio</a>
              </li>
              <li>
                <a>Document</a>
              </li>
            </ul>
          </div> */}

          <input
            type="text"
            placeholder="Type here"
            className="min-w-auto h-full ps-2 flex-1 outline-none focus:outline-none focus-visible:outline-none border-none focus:border-none focus-visible:border-none"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
          />
          <button
            className="btn btn-primary btn-circle"
            disabled={loading}
            type="submit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </form>
    </>
  );
}
