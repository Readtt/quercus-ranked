// apps/extension/src/_components/course-section.tsx
import { useEffect, useMemo, useState } from "react";
import { fetchAssignmentAverage, submitAssignmentServerSide } from "@/utils/averages";
import { pct, formatYourGrade } from "@/utils/grades";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";
import { BookOpen, CheckCircle } from "lucide-react";
import { QuercusAssignment, QuercusCourse } from "@/utils/types";
import { getQuercusCookieHeader } from "@/utils/quercus-cookies";

type Props = {
  course: QuercusCourse;
  unauthorized: boolean;
  assignments: QuercusAssignment[] | undefined;
  isLoadingThisCourse: boolean;
  hasFetched: boolean;
};

type AvgMap = Record<number, { avg: number | null; count: number }>;

export function CourseSection({
  course,
  unauthorized,
  assignments = [],
  isLoadingThisCourse,
  hasFetched,
}: Props) {
  const graded = useMemo(
    () => assignments.filter((v) => v.submission?.workflow_state === "graded"),
    [assignments]
  );

  const [avgByAssignment, setAvgByAssignment] = useState<AvgMap>({});
  const [submittedFor, setSubmittedFor] = useState<Record<number, boolean>>({});

  useEffect(() => {
    (async () => {
      const ids = graded.map((g) => g.id);
      await Promise.all(
        ids.map(async (id) => {
          if (avgByAssignment[id] !== undefined) return;
          const res = await fetchAssignmentAverage(id);
          setAvgByAssignment((prev) => ({
            ...prev,
            [id]: { avg: res?.avgPercent ?? null, count: res?.count ?? 0 },
          }));
        })
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graded.length]);

useEffect(() => {
  (async () => {
    const cookie = await getQuercusCookieHeader();

    for (const a of graded) {
      if (submittedFor[a.id]) continue;

      submitAssignmentServerSide({
        assignmentId: a.id,
        courseId: a.course_id,
        cookie,
      }).finally(() => {
        setSubmittedFor((prev) => ({ ...prev, [a.id]: true }));
      });
    }
  })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [graded.length]);

  return (
    <AccordionItem value={course.id.toString()}>
      <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold text-sm">
            {course.course_code}
            {course.teachers?.[0] && (
              <p className="text-xs text-muted-foreground">{course.teachers[0].display_name}</p>
            )}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 py-4 space-y-4">
        {unauthorized ? (
          <div className="text-xs text-muted-foreground">
            Please log in to Quercus to view assignments.{" "}
            <a href="https://q.utoronto.ca/" target="_blank" rel="noreferrer" className="underline">
              https://q.utoronto.ca/
            </a>
          </div>
        ) : !hasFetched && !isLoadingThisCourse ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Loading assignments…</p>
          </div>
        ) : isLoadingThisCourse ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Loading assignments…</p>
          </div>
        ) : graded.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No assignments found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {graded.map((assignment) => {
              const fg = formatYourGrade(assignment);
              const isGraded = assignment.submission?.workflow_state === "graded";
              const avgInfo = avgByAssignment[assignment.id];
              const avgText = avgInfo?.avg != null ? `${avgInfo.avg}%` : "—";

              return (
                <div
                  key={assignment.id}
                  className={`p-3 rounded-lg border transition-all hover:shadow-sm ${
                    isGraded ? "bg-green-50 border-green-200" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm truncate pr-2 flex-1">{assignment.name}</h4>
                    {isGraded && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-xs">
                      <span className={`font-medium ${fg.color}`}>{fg.text}</span>
                      <span className="text-muted-foreground">Avg: {avgText}</span>
                    </div>
                    {avgInfo?.count ? (
                      <span className="text-[10px] text-muted-foreground">{avgInfo.count} submissions</span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}