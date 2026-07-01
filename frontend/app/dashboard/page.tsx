"use client";

import { useRouter } from "next/navigation";
import UploadResume from "@/components/dashboard/UploadResume";

export default function DashboardPage() {
  const router = useRouter();

  const handleSuccess = (data: any) => {
    // store resume globally
    localStorage.setItem("resume_text", data.resume_text);

    // 🔥 AUTO FLOW
    router.push("/workspace");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <UploadResume onSuccess={handleSuccess} />
    </div>
  );
}
