import { DEPARTMENTS_PATH } from "@/modules/system";

export function getDepartmentHref(id: string) {
  return `${DEPARTMENTS_PATH}/${id}`;
}
