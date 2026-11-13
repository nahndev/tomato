import type { PaginatedResponse } from "@/shared/types/api.types";
import { apiClient } from "@/shared/lib/api-client";
import { USER_LIST_PAGE_SIZE } from "../user.constants";
import type { UserDetailInput, UserInput } from "../user.schemas";
import type { User } from "../user.types";

const USERS_URL = "/users";
const usersUrl = (departmentId: string) => `/departments/${departmentId}/users`;

export async function listUsers(departmentId: string, roleId?: string): Promise<PaginatedResponse<User>> {
  const { data } = await apiClient.get<PaginatedResponse<User>>(usersUrl(departmentId), {
    params: { pageSize: USER_LIST_PAGE_SIZE, roleId },
  });
  return data;
}

/** Every page of `GET /users`: all users, or those of `departmentId`. */
export async function listAllUsers(departmentId?: string): Promise<User[]> {
  const users: User[] = [];
  for (let page = 1; ; page++) {
    const { data } = await apiClient.get<PaginatedResponse<User>>(USERS_URL, {
      params: { page, pageSize: USER_LIST_PAGE_SIZE, departmentId },
    });
    users.push(...data.items);
    if (data.items.length === 0 || users.length >= data.total) return users;
  }
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

export async function uploadUserAvatar(departmentId: string, id: string, fileId: string): Promise<User> {
  const { data } = await apiClient.put<User>(`${usersUrl(departmentId)}/${id}/avatar`, { fileId });
  return data;
}

export async function deleteUser(departmentId: string, id: string): Promise<void> {
  await apiClient.delete(`${usersUrl(departmentId)}/${id}`);
}
