import { authHeader } from "./auth";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://3.223.73.199:8000";

// =====================================
// Generic Request Helper
// =====================================

async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const headers = {
    ...(options.headers || {}),
    ...authHeader(),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.detail || "Something went wrong"
    );
  }

  return data;
}

// =====================================
// Authentication
// =====================================

export async function registerUser(payload: {
  full_name: string;
  email: string;
  password: string;
}) {
  return apiRequest("/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: {
  email: string;
  password: string;
}) {
  return apiRequest("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser() {
  return apiRequest("/auth/me");
}

// =====================================
// Resume Upload
// =====================================

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/resume/upload`, {
    method: "POST",
    headers: authHeader(),
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Upload failed");
  }

  return data;
}

// =====================================
// Search Jobs
// =====================================

export async function searchJobs(
  resumeText: string,
  sessionId: string
) {
  return apiRequest("/search/jobs", {
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
}

// =====================================
// AI Orchestrator
// =====================================

export async function runOrchestrator(payload: {
	
  user_id: number; 
  resume_text: string;
  profile: any;
  preferences: any;
}) 
{
  console.log("========== SENDING TO API ==========");
  console.log(payload);

  return apiRequest("/orchestrator/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// =====================================
// Resume Versions
// =====================================

export async function getResumeVersions(
  userId: number,
  sessionId: string
) {
  return apiRequest(
    `/resume-versions/${userId}/${sessionId}`
  );
}

export async function regenerateResume(
  userId: number,
  sessionId: string
) {
  return apiRequest("/regenerate/resume", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      session_id: sessionId,
    }),
  });
}

export async function regenerateCoverLetter(
  userId: number,
  sessionId: string
) {
  return apiRequest("/regenerate/cover-letter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      session_id: sessionId,
    }),
  });
}
