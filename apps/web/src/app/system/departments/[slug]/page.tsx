import { getDepartmentHref } from "@/modules/department";
import { DEPARTMENT_SECTIONS } from "@/modules/department-workspace";
import { getFirstNavHref } from "@/modules/system";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`${getDepartmentHref(slug)}${getFirstNavHref(DEPARTMENT_SECTIONS) ?? ""}`);
}
