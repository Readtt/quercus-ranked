import { QuercusAssignment, QuercusCourse, QuercusUser } from "./types";
import { ApiClient, ApiResponse } from "@workspace/api-client";

const client = new ApiClient("https://q.utoronto.ca");

export async function getCourseAssignments(
  courseId: number,
  options: RequestInit = {}
): Promise<ApiResponse<QuercusAssignment[]>> {
  return client.get<QuercusAssignment[]>(
    `/api/v1/users/self/courses/${courseId}/assignments?include[]=submission`,
    options
  );
}

/** Fetch the current user’s active student courses */
export async function getCourses(
  options: RequestInit = {}
): Promise<ApiResponse<QuercusCourse[]>> {
  return client.get<QuercusCourse[]>(
    "/api/v1/users/self/courses" +
      "?include[]=needs_grading_count" +
      "&include[]=syllabus_body" +
      "&include[]=public_description" +
      "&include[]=total_scores" +
      "&include[]=current_grading_period_scores" +
      "&include[]=grading_periods" +
      "&include[]=term" +
      "&include[]=account" +
      "&include[]=course_progress" +
      "&include[]=sections" +
      "&include[]=storage_quota_used_mb" +
      "&include[]=total_students" +
      "&include[]=passback_status" +
      "&include[]=favorites" +
      "&include[]=teachers" +
      "&include[]=observed_users" +
      "&include[]=course_image" +
      "&include[]=banner_image" +
      "&include[]=concluded" +
      "&include[]=post_manually" +
      "&enrollment_type=student" +
      "&enrollment_state=active",
    options
  );
}

/** Fetch the current user’s profile information */
export async function getUser(
  options: RequestInit = {}
): Promise<ApiResponse<QuercusUser>> {
  return client.get<QuercusUser>(
    "/api/v1/users/self?include[]=uuid&include[]=last_login",
    options
  );
}