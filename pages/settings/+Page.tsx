import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [apiKey, setApiKey] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [systemInstruction, setSystemInstruction] = useState<string>("");
  const saveModalRef = useRef<HTMLDialogElement>(null);
  const resetModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setApiKey(localStorage.getItem("apiKey") || "");
    setModel(localStorage.getItem("model") || "gemini-3.5-flash-lite");
    setSystemInstruction(localStorage.getItem("systemInstruction") || "");
  }, []);

  const onSave = () => {
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("model", model);
    localStorage.setItem("systemInstruction", systemInstruction);
    saveModalRef.current?.showModal();
  };
  const onReset = () => {
    localStorage.clear();
    location.href = "/";
  };
  return (
    <section className="p-4 flex flex-col gap-2">
      {/* api key */}
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Custom API Key</legend>
        <input
          type="text"
          className="input w-full"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </fieldset>

      <div className="divider" />

      {/* model */}
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Customize Model</legend>
        <input
          type="text"
          className="input w-full"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={!apiKey}
          aria-disabled={!apiKey}
        />
        <p className="label">Optional</p>
      </fieldset>

      {/* System Instruction */}
      <fieldset className="fieldset">
        <legend className="fieldset-legend">System Instruction</legend>
        <input
          type="text"
          className="input w-full"
          placeholder="You are a cat. Your name is Neko."
          value={systemInstruction}
          onChange={(e) => setSystemInstruction(e.target.value)}
          disabled={!apiKey}
          aria-disabled={!apiKey}
        />
        <p className="label">Optional</p>
      </fieldset>

      {/* reset or save */}

      <div className="flex items-center justify-center gap-4">
        <div className="flex-1"></div>
        <button
          className="btn btn-error"
          onClick={() => resetModalRef.current?.showModal()}
        >
          Reset
        </button>
        <button className="btn btn-primary" onClick={onSave}>
          Save
        </button>
      </div>

      <dialog className="modal" ref={saveModalRef}>
        <div className="modal-box bg-success">
          <h3 className="font-bold text-lg">Save successful!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-ghost">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog className="modal" ref={resetModalRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">Reset will remove your chats and settings.</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-ghost mr-2">Close</button>
              <button className="btn btn-error" onClick={onReset}>
                Reset
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </section>
  );
}
