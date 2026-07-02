"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  uploadResume,
  runOrchestrator,
} from "@/lib/api";

export default function UploadResume() {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Please select a PDF.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      setStatus("Uploading resume...");

      const upload = await uploadResume(file);

      localStorage.setItem(
        "resume_text",
        upload.resume_text
      );

      localStorage.removeItem("workflow_result");

      setStatus("Running AI Agent...");

      const workflow = await runOrchestrator({
        resume_text: upload.resume_text,
        profile: {},
        preferences: {},
      });
      console.log("===== WORKFLOW RESPONSE =====");
      console.log(workflow);
      
      console.log("Selected Jobs:");
      
      console.log(workflow.selected_jobs);


      localStorage.setItem(
  
	      "workflow_result",
  
	      JSON.stringify(workflow)

      );


      console.log("Saved to localStorage:");

      console.log(
  
	      JSON.parse(localStorage.getItem("workflow_result")!)

      );
      localStorage.setItem(
        "workflow_result",
        JSON.stringify(workflow)
      );

      localStorage.setItem(
        "resume_uploaded",
        "true"
      );

      setStatus("Completed");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      setFile(null);

      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Workflow failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0b10] p-8">

      <h2 className="text-2xl font-semibold mb-2">
        Upload Resume
      </h2>

      <p className="text-white/60 mb-6">
        Upload your latest resume.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          setFile(e.target.files?.[0] || null);
          setError("");
        }}
      />

      {status && (
        <p className="mt-4 text-cyan-400">
          {status}
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-400">
          {error}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="mt-6 w-full rounded-xl bg-cyan-500 py-3 text-black font-semibold"
      >
        {loading ? "AI is Working..." : "Upload & Start AI"}
      </button>

    </div>
  );
}
