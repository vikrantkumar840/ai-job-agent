"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

import WorkspaceLayout from "@/components/layout/WorkspaceLayout";

import UploadResume from "@/components/dashboard/UploadResume";

import Overview from "@/components/workspace/Overview";
import Search from "@/components/workspace/Search";
import Resume from "@/components/workspace/Resume";
import CoverLetter from "@/components/workspace/CoverLetter";
import Interview from "@/components/workspace/Interview";
import Results from "@/components/workspace/Results";

export default function DashboardPage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const [active, setActive] = useState("Overview");

  const [result, setResult] = useState<any>(null);

  const [resumeUploaded, setResumeUploaded] =
    useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const uploaded =
      localStorage.getItem("resume_uploaded");

    setResumeUploaded(uploaded === "true");

    const saved =
      localStorage.getItem("workflow_result");

    if (saved) {
      setResult(JSON.parse(saved));
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink font-mono text-sm text-paper-dim">
        <span className="animate-pulse">Loading workspace…</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // New user
  if (!resumeUploaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-6">
        <UploadResume />
      </div>
    );
  }

  function renderContent() {
    switch (active) {
      case "Search Jobs":
        return <Search />;

      case "Resume":
        return <Resume />;

      case "Cover Letter":
        return <CoverLetter />;

      case "Interview":
        return <Interview />;

      case "Results":
        return <Results />;

      default:
        return (
          <Overview
            setActive={setActive}
            data={result}
          />
        );
    }
  }

  return (
    <WorkspaceLayout
      active={active}
      setActive={setActive}
      credits={user.credits}
    >
      {renderContent()}
    </WorkspaceLayout>
  );
}
