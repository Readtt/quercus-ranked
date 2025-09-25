import { useEffect, useState } from "react";
import { getCourses, getUser } from "@/utils/api";
import { QuercusCourse, QuercusUser } from "@/utils/types";

const is401 = (status?: number | null) => status === 401;

export function useCoreData() {
  const [user, setUser] = useState<QuercusUser | null>(null);
  const [courses, setCourses] = useState<QuercusCourse[]>([]);
  const [coreLoading, setCoreLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    (async () => {
      setCoreLoading(true);
      const [userRes, courseRes] = await Promise.all([getUser(), getCourses()]);

      if (is401(userRes.error?.status) || is401(courseRes.error?.status)) {
        setUnauthorized(true);
        setCoreLoading(false);
        return;
      }

      if (userRes.success && userRes.data) setUser(userRes.data);
      if (courseRes.success && courseRes.data) setCourses(courseRes.data);
      setCoreLoading(false);
    })();
  }, []);

  return { user, courses, coreLoading, unauthorized, setUnauthorized };
}