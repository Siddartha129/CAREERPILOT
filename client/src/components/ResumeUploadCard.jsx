import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./Button.jsx";

export function ResumeUploadCard({ onUpload, uploading, result }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  return (
    <section className="card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Current Resume</h2>
          <p className="text-sm text-ink/65">A new PDF replaces the profile and restarts resume-derived pipeline stages.</p>
        </div>
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          accept="application/pdf"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              setFileName(file.name);
              onUpload(file);
            }
          }}
        />
        <Button onClick={() => inputRef.current?.click()} disabled={uploading}><UploadCloud size={18} />{uploading ? "Uploading..." : "Upload PDF"}</Button>
      </div>
      {fileName ? <p className="mt-3 text-sm font-semibold text-ink/70">{fileName}</p> : null}
      {result?.pipelineReset ? <p className="mt-3 rounded-md bg-gold/10 px-3 py-2 text-sm font-bold text-gold">Pipeline was reset for the new resume.</p> : null}
    </section>
  );
}
