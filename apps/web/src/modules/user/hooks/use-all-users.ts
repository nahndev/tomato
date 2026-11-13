"use client";

import { useQuery } from "@tanstack/react-query";
import { listAllUsers } from "../services/users.service";
import { userKeys } from "../user.keys";

export function useAllUsers(departmentId?: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: userKeys.directoryList(departmentId),
    queryFn: () => listAllUsers(departmentId),
  });

  return { users: data ?? [], isLoading, hasError: isError };
}
