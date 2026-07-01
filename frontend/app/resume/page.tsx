"use client";

import { useState } from "react";
import { uploadResume} from "@/lib/api";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleStart = async () => {
    if (!file) return;

    setLoading(true);

    try {
      // 1. Upload resume
      const uploadRes = await uploadResume(file);

      // 2. Extract profile
      const profileRes = await extractProfile(uploadRes.resume_text);

      // 3. Start AI orchestrator
      const agentRes = await startOrchestrator({
        resume_text: uploadRes.resume_text,
        profile: profileRes.profile,
        preferences: {
          role: "devops",
          city: "bangalore"
        }
      });

      setResult(agentRes);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold">AI Job Agent</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleStart}
        className="bg-green-600 px-4 py-2 mt-4 rounded"
      >
        {loading ? "Processing..." : "Start AI Agent"}
      </button>

      {result && (
        <pre className="mt-5 bg-black p-4 text-green-300 overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
