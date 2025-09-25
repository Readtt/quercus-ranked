import { AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";
import { BookOpen, GraduationCap, Mail, User, Users } from "lucide-react";
import { QuercusCourse, QuercusUser } from "@/utils/types";
import { ProfileSkeleton } from "./skeletons";

type Props = {
  coreLoading: boolean;
  unauthorized: boolean;
  user: QuercusUser | null;
  courses: QuercusCourse[];
};

export function ProfileSection({ coreLoading, unauthorized, user, courses }: Props) {
  return (
    <AccordionItem value="profile">
      <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
        <span className="font-semibold flex items-center gap-2">
          <User className="w-4 h-4 text-red-600" />
          PROFILE
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        {coreLoading ? (
          <ProfileSkeleton />
        ) : unauthorized ? (
          <div className="space-y-3 py-2 text-xs text-muted-foreground">
            <p>You’re not authenticated. Use the banner link above to log in to Quercus and refresh.</p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user?.name}</p>
                {user?.email && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                ENROLLED COURSES ({courses.length})
              </h4>
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-xs font-medium truncate">{course.course_code}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate ml-6">{course.name}</p>
                  </div>
                  {course.total_students && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {course.total_students}
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-2 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Synced just now</span>
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
