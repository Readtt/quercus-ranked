import { getQuercusCookieHeader } from "./quercus-cookies";

const API_BASE = "https://quercus-ranked-web.vercel.app";

export type AvgResponse = {
  assignmentId: number;
  avgPercent: number | null;
  count: number;
};

export async function fetchAssignmentAverage(
  assignmentId: number
): Promise<AvgResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/averages?assignmentId=${assignmentId}`,
      {
        credentials: "omit",
      }
    );
    if (!res.ok) return null;
    return (await res.json()) as AvgResponse;
  } catch {
    return null;
  }
}

export async function syncAssignments() {
  try {
    const cookie = getQuercusCookieHeader();
    
    await fetch(`${API_BASE}/api/averages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "omit",
      body: JSON.stringify({ cookie }),
    });
  } catch {}
}
