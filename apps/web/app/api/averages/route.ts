import { neon } from "@neondatabase/serverless";
import {
  getCourseAssignments,
  getCourses,
  getUser,
} from "@workspace/quercus-client/api";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const assignmentId = Number(searchParams.get("assignmentId"));
  const courseIdParam = searchParams.get("courseId");
  const courseId = courseIdParam ? Number(courseIdParam) : null;

  if (!assignmentId || Number.isNaN(assignmentId)) {
    return NextResponse.json({ error: "assignmentId required" }, { status: 400 });
  }
  if (courseIdParam && (courseId == null || Number.isNaN(courseId))) {
    return NextResponse.json({ error: "courseId must be a number" }, { status: 400 });
  }

  try {
    const sql = neon(process.env.NEON_DATABASE_URL!);

    const rows = await sql/* sql */`
      select
        round(avg(percent))::int     as avg,
        count(distinct user_id)::int as count
      from assignment_scores
      where assignment_id = ${assignmentId}
        and percent is not null
        and (${courseId} is null or course_id = ${courseId})
    `;

    const { avg, count } = rows?.[0] ?? { avg: null, count: 0 };
    return NextResponse.json({ assignmentId, avgPercent: avg, count });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "DB error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  type Body = { cookie?: string };

  let body: Body | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const cookie = (body?.cookie ?? "").trim();
  if (!cookie) {
    return NextResponse.json({ error: "cookie required" }, { status: 400 });
  }

  try {
    const sql = neon(process.env.NEON_DATABASE_URL!);

    // 0) Who is the user? (for user_id)
    const userRes = await getUser({ headers: { cookie } });
    if (!userRes.success || !userRes.data) {
      return NextResponse.json(
        { error: userRes.error?.message || "Failed to fetch user" },
        { status: 502 }
      );
    }
    const userId = userRes.data.id;

    // 1) Fetch all active student courses
    const coursesRes = await getCourses({ headers: { cookie } });
    if (!coursesRes.success || !coursesRes.data) {
      return NextResponse.json(
        { error: coursesRes.error?.message || "Failed to fetch courses" },
        { status: 502 }
      );
    }
    const courses = coursesRes.data;

    let processed = 0;
    let upserts = 0;
    let skippedNoScore = 0;

    // 2) For each course, fetch assignments (with user's submission)
    for (const course of courses) {
      const courseId = course.id;

      const aRes = await getCourseAssignments(courseId, { headers: { cookie } });
      if (!aRes.success || !aRes.data) {
        // skip this course but continue others
        continue;
      }

      for (const a of aRes.data) {
        processed++;

        const score = a?.submission?.score ?? null;
        const pts = a?.points_possible ?? null;

        if (score == null || pts == null || pts === 0) {
          skippedNoScore++;
          continue;
        }

        // Compute and clamp to 0..100 just in case
        let percent = Math.round((score / pts) * 100);
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;

        // 3) Upsert per-(assignment_id, user_id)
        await sql/* sql */`
          insert into assignment_scores (user_id, course_id, assignment_id, percent)
          values (${userId}, ${courseId}, ${a.id}, ${percent})
          on conflict (assignment_id, user_id)
          do update set
            percent    = excluded.percent,
            course_id  = excluded.course_id,
            updated_at = now();
        `;

        upserts++;
      }
    }

    return NextResponse.json({
      ok: true,
      userId,
      processed,
      upserts,
      skippedNoScore,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}