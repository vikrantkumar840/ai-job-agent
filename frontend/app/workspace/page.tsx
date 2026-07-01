"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import WorkspaceLayout from "@/components/layout/WorkspaceLayout";

import Overview from "@/components/workspace/Overview";
import Search from "@/components/workspace/Search";
import Resume from "@/components/workspace/Resume";
import CoverLetter from "@/components/workspace/CoverLetter";
import Interview from "@/components/workspace/Interview";
import Results from "@/components/workspace/Results";

export default function WorkspacePage() {
  const router = useRouter();
  const [active, setActive] = useState("Overview");

  useEffect(() => {
    const resume = localStorage.getItem("resume_uploaded");
    if (!resume) {
      router.push("/dashboard");
    }
  }, []);

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
        return <Overview setActive={setActive} />;
    }
  };

  return (
    <WorkspaceLayout active={active} setActive={setActive}>
      {renderContent()}
    </WorkspaceLayout>
  );
}
