import type { ApiError, ApiErrorResponse } from "@tomato/types";
import axios, { isAxiosError } from "axios";

const API_BASE_URL = "/rest/core";

export const apiClient = axios.create({ baseURL: API_BASE_URL });

export function getApiError(error: unknown): ApiError | undefined {
  if (!isAxiosError<ApiErrorResponse>(error)) return undefined;
  return error.response?.data?.error;
}
