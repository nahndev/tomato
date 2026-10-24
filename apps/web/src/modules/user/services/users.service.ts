import type { PaginatedResponse, User } from "@tomato/types";
import { apiClient } from "@/shared/lib/api-client";
import { USER_LIST_PAGE_SIZE } from "../user.constants";
import type { UserInput } from "../user.schemas";

const usersUrl = (departmentId: string) => `/departments/${departmentId}/users`;

export async function listUsers(departmentId: string): Promise<PaginatedResponse<User>> {
  const { data } = await apiClient.get<PaginatedResponse<User>>(usersUrl(departmentId), {
    params: { pageSize: USER_LIST_PAGE_SIZE },
  });
  return data;
}

export async function createUser(departmentId: string, input: UserInput): Promise<User> {
  const { data } = await apiClient.post<User>(usersUrl(departmentId), input);
  return data;
}

export async function updateUser(departmentId: string, id: string, input: Partial<UserInput>): Promise<User> {
  const { data } = await apiClient.patch<User>(`${usersUrl(departmentId)}/${id}`, input);
  return data;
}

export async function deleteUser(departmentId: string, id: string): Promise<void> {
  await apiClient.delete(`${usersUrl(departmentId)}/${id}`);
}
