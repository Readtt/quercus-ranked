import { Accordion } from "@workspace/ui/components/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { CourseSection } from "./_components/course-section";
import { ProfileSection } from "./_components/profile-section";
import { UnauthorizedBanner } from "./_components/unauthorized-banner";
import { useAssignments } from "./hooks/useAssignments";
import { useCoreData } from "./hooks/useCoreData";

const App = () => {
  const { user, courses, coreLoading, unauthorized, setUnauthorized } = useCoreData();

  const {
    openValues,
    onAccordionChange,
    assignmentsByCourse,
    loadingByCourse,
    fetchedByCourse,
  } = useAssignments({ unauthorized, setUnauthorized });

  return (
    <Card className="w-80 rounded-none border gap-0 py-0 shadow-lg">
      <CardHeader className="flex flex-col gap-2 border-b py-4 [.border-b]:pb-4 bg-gradient-to-r from-red-50 to-red-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 bg-gradient-to-br from-red-500 to-red-700 rotate-45 shadow-sm" />
            <CardTitle className="text-base font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Quercus Ranked
            </CardTitle>
          </div>
        </div>

        {unauthorized && <UnauthorizedBanner />}
      </CardHeader>

      <CardContent className="p-0">
        <Accordion type="multiple" value={openValues} onValueChange={onAccordionChange} className="w-full">
          <ProfileSection
            coreLoading={coreLoading}
            unauthorized={unauthorized}
            user={user}
            courses={courses}
          />

          {courses.map((course) => {
            const cid = Number(course.id);
            return (
              <CourseSection
                key={course.id}
                course={course}
                unauthorized={unauthorized}
                assignments={assignmentsByCourse[cid]}
                isLoadingThisCourse={!!loadingByCourse[cid]}
                hasFetched={!!fetchedByCourse[cid]}
              />
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default App;