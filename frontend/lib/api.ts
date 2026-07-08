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
export async function searchJobs(resumeText: string, sessionId: string) {
  const res = await fetch(`${BASE_URL}/search/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: resumeText,
      session_id: sessionId,
      limit: 10,
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
/**
 * Resume Versions
 */
export async function getResumeVersions(
  userId: number,
  sessionId: string
) {
  const res = await fetch(
    `${BASE_URL}/resume-versions/${userId}/${sessionId}`
  );

  if (!res.ok) {
    throw new Error("Failed to load resume versions");
  }

  return res.json();
}
export async function regenerateResume(
  userId: number,
  sessionId: string
) {
  const res = await fetch(`${BASE_URL}/regenerate/resume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      session_id: sessionId,
    }),
  });

  return res.json();
}

export async function regenerateCoverLetter(
  userId: number,
  sessionId: string
) {
  const res = await fetch(`${BASE_URL}/regenerate/cover-letter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      session_id: sessionId,
    }),
  });

  return res.json();
}
