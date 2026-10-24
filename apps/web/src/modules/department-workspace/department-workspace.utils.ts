import { DEPARTMENT_PATH } from "./department-workspace.constants";

export function getDepartmentHref(slug: string) {
  return `${DEPARTMENT_PATH}/${slug}`;
}
