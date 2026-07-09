"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import WorkspaceLayout from "@/components/layout/WorkspaceLayout";

import Overview from "@/components/workspace/Overview";
import Search from "@/components/workspace/Search";
import Resume from "@/components/workspace/Resume";
import CoverLetter from "@/components/workspace/CoverLetter";
import Interview from "@/components/workspace/Interview";
import Results from "@/components/workspace/Results";

export default function DashboardPage() {
  const [active, setActive] = useState("Overview");
  const [result, setResult] = useState<any>(null);
  const router = useRouter();
  const {
	  user,
	  loading,
  } = useAuth();
  
  useEffect(() => {
	  if (!loading && !user) {
		  router.replace("/login");
	  }
  }, [loading, user, router]);





  useEffect(() => {
	  const saved = localStorage.getItem("workflow_result");
	  console.log("===== DASHBOARD LOADED =====");
	  if (saved) {
		  const parsed = JSON.parse(saved);
		  console.log(parsed);
		  setResult(parsed);
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
        return (
          <Overview
            setActive={setActive}
            data={result}
          />
        );
    }
  };
  if (loading) {
	  return (
		  <div className="flex min-h-screen items-center justify-center">
		  Loading...
		  </div>
	  );
  }

if (!user) {
  return null;
}

  return (
    <WorkspaceLayout
      active={active}
      setActive={setActive}
    >
      {renderContent()}
    </WorkspaceLayout>
  );
}
