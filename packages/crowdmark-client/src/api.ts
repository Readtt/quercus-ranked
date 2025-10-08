import { ApiClient, ApiResponse } from "@workspace/api-client";
import {
  CrowdmarkAccountApiResponse,
  CrowdmarkAssignmentsApiResponse,
  CrowdmarkCoursesApiResponse,
} from "./types";

const client = new ApiClient("https://app.crowdmark.com");

export async function getCourses(
  options: RequestInit = {}
): Promise<ApiResponse<CrowdmarkCoursesApiResponse>> {
  return client.get<CrowdmarkCoursesApiResponse>(
    "/api/v2/student/courses?include[]=course-archivation",
    options
  );
}

export async function getAccount(
  options: RequestInit = {}
): Promise<ApiResponse<CrowdmarkAccountApiResponse>> {
  return client.get<CrowdmarkAccountApiResponse>("/api/v2/account", options);
}

export async function getAssignments(
  options: RequestInit = {}
): Promise<ApiResponse<CrowdmarkAssignmentsApiResponse>> {
  const path =
    "/api/v2/student/assignments" +
    "?fields[exam-masters][]=type" +
    "&fields[exam-masters][]=title" +
    "&fields[exam-masters][]=course" +
    "&filter[upcoming]=true" +
    "&filter[type]=assigned" +
    "&sort=due";

  return client.get<CrowdmarkAssignmentsApiResponse>(path, options);
}
