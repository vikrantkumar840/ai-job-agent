"use client";

export default function Overview({ setActive }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        Resume Uploaded Successfully
      </h2>

      <p className="text-white/60 mb-6">
        Your AI workspace is ready.
      </p>

      <button
        onClick={() => setActive("Search Jobs")}
        className="bg-white text-black px-4 py-2 rounded-lg"
      >
        Start Searching Jobs
      </button>
    </div>
  );
}
