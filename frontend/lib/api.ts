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

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
	data?.detail ||
	data?.message ||
	"Something Went Wrong"
    );  }

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

  const data = await res.json().catch(() => ({}));

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
interface UserProfile {
  skills?: string[];
  education?: string;
  experience?: string;
}

interface UserPreferences {
  location: string;
  department: string;
  experience: string;
  website: string;
  jobs_count: number;
}

export async function runOrchestrator(payload: {
  user_id: number;
  resume_text: string;
  profile: UserProfile;
  preferences: UserPreferences;
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

// =====================================
// Ask AI for More Jobs
// =====================================

export async function regenerateJobs(payload: {
  user_id: number;
  session_id: string;
  jobs_count: number;
}) {
  return apiRequest("/jobs/regenerate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// =====================================
// Resume Parsing
// =====================================

export async function parseResume(file: File) {
  return uploadResume(file);
}

// =====================================
// Auto Apply
// =====================================

export async function previewAutoApply(payload: {
  job_url: string;
  full_name: string;
  email: string;
  resume_path: string;
  location: string;
  linkedin_url: string;
}) {
  return apiRequest("/auto-apply/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function confirmAutoApply(
  autoApplyId: number,
  payload: {
    full_name: string;
    email: string;
    resume_path: string;
    location: string;
    linkedin_url: string;
  }
) {
  return apiRequest(`/auto-apply/${autoApplyId}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function rejectAutoApply(autoApplyId: number) {
  return apiRequest(`/auto-apply/${autoApplyId}/reject`, {
    method: "POST",
  });
}

export function autoApplyScreenshotUrl(autoApplyId: number) {
  return `${BASE_URL}/auto-apply/${autoApplyId}/screenshot`;
}

export async function quickApply(payload: {
  job_url: string;
  job_title?: string;
  job_company?: string;
  full_name: string;
  email: string;
  resume_path?: string;
  location?: string;
  linkedin_url?: string;
  notify_email?: string;
}) {
  return apiRequest("/auto-apply/quick", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
