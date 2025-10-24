export type FormType = "create" | "view" | "update";

export type UserRole = "customer" | "admin";

export type SortOrder = "asc" | "desc";

export interface IApiSuccessResponse<
  T = unknown,
  M = Record<string, string | number | boolean | null | undefined>,
> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  error: null;
  meta?: {
    page: number;
    limit: number;
    totalResults: number;
    searchTerm?: string;
    sortBy: string;
    sortOrder: "asc" | "desc" | 1 | -1 | "ascending" | "descending";
  } & M;
}

export interface IApiFailedResponse<E = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  error: {
    type:
      | "zod-error"
      | "internal-server-error"
      | "validation"
      | "authorization"
      | "authentication"
      | "bad-request";
    message: string;
    data?: E | null;
  };
  data?: null;
  meta?: {
    page: number;
    limit: number;
    totalResults: number;
    searchTerm?: string;
    sortBy: string;
    sortOrder: "asc" | "desc" | 1 | -1 | "ascending" | "descending";
  };
  Error?: string;
  ErrorStack?: string;
}

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}
