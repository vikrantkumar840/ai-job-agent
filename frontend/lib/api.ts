const API_URL = "http://3.223.73.199:8000";// change to EC2 IP in prod

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/resume/upload`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function extractProfile(resume_text: string) {
  const res = await fetch(`${API_URL}/profile/extract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_text }),
  });

  return res.json();
}

export async function startOrchestrator(data: any) {
  const res = await fetch(`${API_URL}/orchestrator/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}
