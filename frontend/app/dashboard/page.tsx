"use client";

import { useEffect, useState } from "react";

import WorkspaceLayout from "@/components/layout/WorkspaceLayout";

import Overview from "@/components/workspace/Overview";
import Search from "@/components/workspace/Search";
import Resume from "@/components/workspace/Resume";
import CoverLetter from "@/components/workspace/CoverLetter";
import Interview from "@/components/workspace/Interview";
import Results from "@/components/workspace/Results";

import { runOrchestrator } from "@/lib/api";

export default function DashboardPage() {
  const [active, setActive] = useState("Overview");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("workflow_result");

    if (saved) {
      setResult(JSON.parse(saved));
    }
  }, []);

  async function handleStartAI() {
    try {
      setLoading(true);
      setError("");

      const resumeText = localStorage.getItem("resume_text");

      if (!resumeText) {
        setError("Resume not found.");
        return;
      }

      const data = await runOrchestrator({
        resume_text: resumeText,
        profile: {},
        preferences: {},
      });

      console.log("===== ORCHESTRATOR RESPONSE =====");
      console.log(data);

      setResult(data);

      localStorage.setItem(
        "workflow_result",
        JSON.stringify(data)
      );
    } catch (err: any) {
      setError(err.message || "Workflow failed");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        🤖 AI Agent is preparing your application...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  const renderContent = () => {
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
            onStartAI={handleStartAI}
          />
        );
    }
  };

  return (
    <WorkspaceLayout
      active={active}
      setActive={setActive}
    >
      {renderContent()}
    </WorkspaceLayout>
  );
}
