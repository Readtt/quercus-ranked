export type JsonApiRef = { type: string; id: string };

export type JsonApiRelationship<T = JsonApiRef | JsonApiRef[] | null> = {
  data: T;
  meta?: Record<string, unknown>;
  links?: { self?: string; related?: string };
};

type JsonApiLinks = { self?: string; related?: string };
type JsonApiVersion = { version: string };

export type JsonApiPagination = {
  "total-records": number;
  "total-pages": number;
  "page-size": number;
  "current-page": number;
  "prev-page": number | null;
  "next-page": number | null;
};

export type JsonApiMeta = {
  pagination: JsonApiPagination;
  [k: string]: unknown;
};

export type JsonApiResource<
  TType extends string,
  TAttributes extends object,
  TRelationships extends Record<string, JsonApiRelationship<any>> = {}
> = {
  id: string;
  type: TType;
  attributes: TAttributes;
  relationships?: TRelationships;
  links?: JsonApiLinks;
};

type JsonApiDocument<D, I = unknown> = {
  data: D;
  included?: I[];
  meta?: JsonApiMeta;
  jsonapi?: JsonApiVersion;
  links?: JsonApiLinks;
};

export type JsonApiTopLevel<T, I = unknown> = JsonApiDocument<T[], I>;
export type JsonApiTopLevelOne<T, I = unknown> = JsonApiDocument<T, I>;

export type CrowdmarkCourseAttributes = {
  name: string;
  "exam-master-count": number;
};

export type CrowdmarkCourseRelationships = {
  "course-archivation": JsonApiRelationship<null | JsonApiRef>;
};

export type CrowdmarkCourseResource = JsonApiResource<
  "courses",
  CrowdmarkCourseAttributes,
  CrowdmarkCourseRelationships
>;

export type CrowdmarkCoursesApiResponse = JsonApiTopLevel<CrowdmarkCourseResource>;

export type CrowdmarkAccountAttributes = {
  id: "current";
  "community-terms-accepted": boolean;
  "display-name": string | null;
  email: string;
  "primary-email-address-id": number | null;
  "pw-last-accessed-at": string | null; // ISO
  "is-student": boolean;
  "is-teammate": boolean;
  "interface-selection": "student" | "instructor" | string;
  "requested-institution-id": number | null;
  "avatar-url": string | null;
  avatar: unknown | null;
  "is-mfa-enabled": boolean | null;
  "is-mfa-required": boolean;
  "has-password": boolean;
};

export type CrowdmarkAccountRelationships = {
  connections: JsonApiRelationship<JsonApiRef[]>;
  "email-addresses": JsonApiRelationship<JsonApiRef[]>;
};

export type CrowdmarkAccountResource = JsonApiResource<
  "account",
  CrowdmarkAccountAttributes,
  CrowdmarkAccountRelationships
>;

// Included
export type CrowdmarkConnectionAttributes = {
  "course-import-enabled": boolean | null;
  "grade-sync-enabled": boolean | null;
  "membership-sync-enabled": boolean | null;
  "is-lti": boolean | null;
  "is-restricted": boolean | null;
  "lms-name": string | null;
  "lms-abbr": string | null;
  "institution-wordmark-url": string | null;
  "institution-name": string | null;
  "institution-slug": string | null;
  key: string | null;
};

export type CrowdmarkConnectionResource = JsonApiResource<
  "connections",
  CrowdmarkConnectionAttributes
>;

export type CrowdmarkEmailAddressAttributes = {
  address: string;
  "merge-bid": string | null;
  "is-verified": boolean;
  "is-primary": boolean;
  "needs-merge": boolean;
  "merge-to-user-email": string | null;
  "source-courses": number | null;
  "source-assessments": number | null;
  "target-courses": number | null;
  "target-assessments": number | null;
  "target-avatar-url": string | null;
  "source-avatar-url": string | null;
};

export type CrowdmarkEmailAddressResource = JsonApiResource<
  "email-address",
  CrowdmarkEmailAddressAttributes
>;

export type CrowdmarkAccountIncluded =
  | CrowdmarkConnectionResource
  | CrowdmarkEmailAddressResource;

export type CrowdmarkAccountApiResponse = JsonApiTopLevelOne<
  CrowdmarkAccountResource,
  CrowdmarkAccountIncluded
>;

export type CrowdmarkEmailAddress = {
  id: string;
  address: string;
  mergeBid: string | null;
  isVerified: boolean;
  isPrimary: boolean;
  needsMerge: boolean;
  mergeToUserEmail: string | null;
  sourceCourses: number | null;
  sourceAssessments: number | null;
  targetCourses: number | null;
  targetAssessments: number | null;
  targetAvatarUrl: string | null;
  sourceAvatarUrl: string | null;
  _raw?: { attributes: CrowdmarkEmailAddressAttributes };
};

export type CrowdmarkAssignmentAttributes = {
  "submitted-at": string | null;
  "retrieved-at": string | null;
  "penalty-period": "day" | "hour" | string | null;
  "penalty-value": number | null;
  due: string | null; // ISO
  "marks-sent-at": string | null;
  "is-locked": boolean;
  "normalized-points": number | null;
  "group-id": number | null;
  "is-part-of-group": boolean;
  "populate-exam-questions-id": number | null;
  "score-uuid": string | null;
  "additional-instructions": string | null;
  "is-facilitator": boolean;
  "penalty-override": number | null;
};

export type CrowdmarkAssignmentRelationships = {
  "exam-master": JsonApiRelationship<JsonApiRef>;
  // Optional relationships can still always expose a 'data' key (null/undefined allowed)
  course?: { meta?: { included?: boolean } } & {
    data: JsonApiRef | null | undefined;
  };
  questions?: { meta?: { included?: boolean } } & {
    data: JsonApiRef[] | null | undefined;
  };
};

export type CrowdmarkAssignmentResource = JsonApiResource<
  "assignments",
  CrowdmarkAssignmentAttributes,
  CrowdmarkAssignmentRelationships
>;

// Minimal included Exam Master (per your query)
export type CrowdmarkExamMasterAttributes = {
  title: string;
  type: string; // e.g., "ExamMaster::AtHome"
};

export type CrowdmarkExamMasterRelationships = {
  course: JsonApiRelationship<JsonApiRef>;
};

export type CrowdmarkExamMasterResource = JsonApiResource<
  "exam-masters",
  CrowdmarkExamMasterAttributes,
  CrowdmarkExamMasterRelationships
>;

export type CrowdmarkAssignmentsIncluded = CrowdmarkExamMasterResource;

export type CrowdmarkAssignmentsApiResponse = JsonApiTopLevel<
  CrowdmarkAssignmentResource,
  CrowdmarkAssignmentsIncluded
>;