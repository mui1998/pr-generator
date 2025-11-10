const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function createPR(data) {
  console.log(JSON.stringify(data));
  const res = await fetch(`${API_BASE}/api/pr`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to create PR");
  return res.json();
}

export async function listPRs() {
  const res = await fetch(`${API_BASE}/api/pr`);
  if (!res.ok) throw new Error("Failed to fetch PRs");
  return res.json();
}
