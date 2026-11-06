import type { ApiError, ApiErrorResponse } from '@tomato/types';
import axios, { isAxiosError } from 'axios';

const STORAGE_API_BASE_URL = '/rest/storage';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
});

export const storageClient = axios.create({ baseURL: STORAGE_API_BASE_URL });

export function getApiError(error: unknown): ApiError | undefined {
  if (!isAxiosError<ApiErrorResponse>(error)) return undefined;
  return error.response?.data?.error;
}
