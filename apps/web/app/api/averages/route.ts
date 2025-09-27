import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAssignmentsWithSubmission } from "@/lib/quercus";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const assignmentId = Number(searchParams.get("assignmentId"));
  if (!assignmentId || Number.isNaN(assignmentId)) {
    return NextResponse.json(
      { error: "assignmentId required" },
      { status: 400 }
    );
  }

  try {
    const rows = await sql`
      select
        round(avg(percent))::int as avg,
        count(*)::int as count
      from assignment_scores
      where assignment_id = ${assignmentId};
    `;

    const { avg, count } = rows?.[0] ?? { avg: null, count: 0 };
    return NextResponse.json({ assignmentId, avgPercent: avg, count });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "DB error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  type Body = {
    assignmentId?: number;
    courseId?: number | null;
    cookie?: string;
  };

  let body: Body | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const assignmentId = Number(body?.assignmentId);
  const courseId = body?.courseId == null ? null : Number(body.courseId);
  const cookie = (body?.cookie ?? "").trim();

  if (!assignmentId || Number.isNaN(assignmentId) || !courseId || Number.isNaN(courseId)) {
    return NextResponse.json(
      { error: "assignmentId and courseId required" },
      { status: 400 }
    );
  }
  if (!cookie) {
    return NextResponse.json(
      { error: "cookie required" },
      { status: 400 }
    );
  }

  try {
    // 1) Fetch assignments (with user's submission) from Quercus
    const assignments = await getAssignmentsWithSubmission(courseId, cookie);

    // 2) Find the specific assignment
    const a = assignments.find((x: any) => Number(x.id) === assignmentId);
    if (!a) {
      return NextResponse.json(
        { error: "Assignment not found in course or not accessible" },
        { status: 404 }
      );
    }

    // 3) Compute percent from server-side submission data
    const score = a?.submission?.score ?? null;
    const pts = a?.points_possible ?? null;

    if (score == null || pts == null || pts === 0) {
      // No score yet → do nothing (avoid inserting nulls)
      return NextResponse.json({ ok: false, reason: "no_score" });
    }

    const percent = Math.round((score / pts) * 100);

    // 4) Persist to Neon
    await sql`
      insert into assignment_scores (assignment_id, course_id, percent)
      values (${assignmentId}, ${courseId}, ${percent});
    `;

    return NextResponse.json({ ok: true, percent });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}