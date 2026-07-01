"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { uploadResume } from "@/lib/api";

export default function UploadResume() {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF resume.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await uploadResume(file);

      localStorage.setItem("resume_uploaded", "true");
      localStorage.setItem("resume_text", res.resume_text);

      // Reset file input
      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      // Go to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0b10] p-8 shadow-2xl">

      <h2 className="text-2xl font-semibold text-white mb-2">
        Upload Your Resume
      </h2>

      <p className="text-white/60 text-sm mb-6">
        Upload your latest resume in PDF format to begin your AI job search.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0] || null;

          setFile(selectedFile);
          setError("");
        }}
        className="block w-full text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-medium file:text-black hover:file:bg-cyan-400 cursor-pointer"
      />

      {file && (
        <p className="mt-3 text-sm text-green-400">
          Selected: {file.name}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Uploading Resume..." : "Upload & Continue"}
      </button>
    </div>
  );
}
