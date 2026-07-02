const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://3.223.73.199:8000";

/**
 * Upload resume PDF
 */
export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/resume/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Upload failed");
  }

  return res.json();
}

/**
 * Search jobs using resume text
 */
export async function searchJobs(resumeText: string) {
  const res = await fetch(`${BASE_URL}/search/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume_text: resumeText,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Job search failed");
  }

  return res.json();
}

/**
 * Run AI Orchestrator
 */
export async function runOrchestrator(payload: {
  resume_text: string;
  profile: any;
  preferences: any;
}) {
	console.log("========== SENDING TO API ==========");
  	console.log(payload);
  	console.log("Resume Length:", payload.resume_text.length);	
	
	
	
	const res = await fetch(`${BASE_URL}/orchestrator/start`, {
    		method: "POST",
    		headers: {
      		"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to run orchestrator");
  }

  return res.json();
}
