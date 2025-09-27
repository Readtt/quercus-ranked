const QUERCUS_BASE = "https://q.utoronto.ca";

export async function quercusFetch<T>(path: string, cookie: string): Promise<T> {
  const res = await fetch(`${QUERCUS_BASE}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie": cookie,
      "Accept": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Quercus ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json() as Promise<T>;
}

/** Fetch all assignments (with submission) for a course; simplest path */
export async function getAssignmentsWithSubmission(
  courseId: number,
  cookie: string
) {
  const path =
    `/api/v1/users/self/courses/${courseId}/assignments` +
    `?include[]=submission`;
  return quercusFetch<any[]>(path, cookie);
}