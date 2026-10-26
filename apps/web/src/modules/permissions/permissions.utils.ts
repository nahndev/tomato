import {
  PERMISSION_RESOURCE_ALL,
  type PermissionResource,
} from "@tomato/constants";
import type { PermissionResourceRef } from "@tomato/types";

export function toResourceRef(
  type: PermissionResource,
  id: string = PERMISSION_RESOURCE_ALL,
): PermissionResourceRef {
  return { type, id };
}

export function toResourceKey({ type, id }: PermissionResourceRef): string {
  return `${type}:${id}`;
}

export function isSameResource(
  a: PermissionResourceRef,
  b: PermissionResourceRef,
): boolean {
  return a.type === b.type && a.id === b.id;
}
