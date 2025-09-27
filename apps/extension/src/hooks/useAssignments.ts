import { useCallback, useState } from "react";
import { getCourseAssignments } from "@workspace/quercus-client/api";
import { QuercusAssignment } from "@workspace/quercus-client/types";

type AssignmentsByCourse = Record<number, QuercusAssignment[]>;
type LoadingByCourse = Record<number, boolean>;
type FetchedByCourse = Record<number, boolean>;

const is401 = (status?: number | null) => status === 401;

export function useAssignments(opts: {
  unauthorized: boolean;
  setUnauthorized: (v: boolean) => void;
}) {
  const { unauthorized, setUnauthorized } = opts;

  const [openValues, setOpenValues] = useState<string[]>(["profile"]);
  const [assignmentsByCourse, setAssignmentsByCourse] = useState<AssignmentsByCourse>({});
  const [loadingByCourse, setLoadingByCourse] = useState<LoadingByCourse>({});
  const [fetchedByCourse, setFetchedByCourse] = useState<FetchedByCourse>({});

  const onAccordionChange = useCallback(
    async (newValues: string[]) => {
      if (unauthorized) {
        setOpenValues(newValues);
        return;
      }

      const newlyOpened = newValues.filter((v) => !openValues.includes(v));
      setOpenValues(newValues);

      const toLoad: number[] = newlyOpened
        .map((v) => Number(v))
        .filter((id) => !Number.isNaN(id) && !fetchedByCourse[id] && loadingByCourse[id] !== true);

      if (toLoad.length === 0) return;

      setLoadingByCourse((prev) => {
        const copy = { ...prev };
        toLoad.forEach((id) => (copy[id] = true));
        return copy;
      });

      const results = await Promise.all(
        toLoad.map(async (cid) => {
          const res = await getCourseAssignments(cid);
          return { cid, res };
        })
      );

      if (results.some(({ res }) => is401(res.error?.status))) {
        setUnauthorized(true);
        setLoadingByCourse((prev) => {
          const copy = { ...prev };
          toLoad.forEach((id) => (copy[id] = false));
          return copy;
        });
        return;
      }

      setAssignmentsByCourse((prev) => {
        const copy = { ...prev };
        results.forEach(({ cid, res }) => {
          copy[cid] = res.success && res.data ? res.data : [];
        });
        return copy;
      });

      setFetchedByCourse((prev) => {
        const copy = { ...prev };
        toLoad.forEach((id) => (copy[id] = true));
        return copy;
      });
      setLoadingByCourse((prev) => {
        const copy = { ...prev };
        toLoad.forEach((id) => (copy[id] = false));
        return copy;
      });
    },
    [unauthorized, openValues, fetchedByCourse, loadingByCourse, setUnauthorized]
  );

  return {
    openValues,
    setOpenValues,
    onAccordionChange,
    assignmentsByCourse,
    loadingByCourse,
    fetchedByCourse,
  };
}