import type { PaginatedResponse, User } from "@tomato/types";
import { apiClient } from "@/shared/lib/api-client";
import { USER_LIST_PAGE_SIZE } from "../user.constants";
import type { UserDetailInput, UserInput } from "../user.schemas";

const usersUrl = (departmentId: string) => `/departments/${departmentId}/users`;

export async function listUsers(departmentId: string): Promise<PaginatedResponse<User>> {
  const { data } = await apiClient.get<PaginatedResponse<User>>(usersUrl(departmentId), {
    params: { pageSize: USER_LIST_PAGE_SIZE },
  });
  return data;
}

export async function getUser(departmentId: string, id: string): Promise<User> {
  const { data } = await apiClient.get<User>(`${usersUrl(departmentId)}/${id}`);
  return data;
}

export async function createUser(departmentId: string, input: UserInput): Promise<User> {
  const { data } = await apiClient.post<User>(usersUrl(departmentId), input);
  return data;
}

export async function updateUser(departmentId: string, id: string, input: Partial<UserDetailInput>): Promise<User> {
  const { data } = await apiClient.patch<User>(`${usersUrl(departmentId)}/${id}`, input);
  return data;
}

export async function uploadUserAvatar(departmentId: string, id: string, file: File): Promise<User> {
  const body = new FormData();
  body.append("file", file);
  const { data } = await apiClient.put<User>(`${usersUrl(departmentId)}/${id}/avatar`, body);
  return data;
}

export function getUserAvatarUrl({ id, departmentId, avatarKey }: User): string | undefined {
  if (!avatarKey) return undefined;
  return apiClient.getUri({ url: `${usersUrl(departmentId)}/${id}/avatar`, params: { v: avatarKey } });
}

export async function deleteUser(departmentId: string, id: string): Promise<void> {
  await apiClient.delete(`${usersUrl(departmentId)}/${id}`);
}
