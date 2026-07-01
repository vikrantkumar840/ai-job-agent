"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { uploadResume } from "@/lib/api";

export default function UploadResume() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError("");

      const res = await uploadResume(file);

      localStorage.setItem("resume_uploaded", "true");
      localStorage.setItem("resume_text", res.resume_text);

      router.push("/workspace");
    } catch (err: any) {
      setError(err?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[420px] bg-[#0a0b10] p-6 rounded-xl border border-white/10">
      <h2 className="text-xl font-semibold mb-4">
        Upload Your Resume
      </h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full bg-white text-black py-2 rounded-lg font-medium"
      >
        {loading ? "Uploading..." : "Upload & Continue"}
      </button>

      {error && (
        <p className="text-red-400 text-sm mt-3">{error}</p>
      )}
    </div>
  );
}
