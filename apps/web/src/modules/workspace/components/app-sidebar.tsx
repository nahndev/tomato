import { UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WORKSPACE_PATH, WORKSPACE_SETTINGS_ITEM } from "../workspace.constants";
import { SidebarNav } from "./sidebar-nav";

const ROUND_CLASS =
  "flex size-9 items-center justify-center rounded-full text-sidebar-foreground transition-colors hover:bg-canvas hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring";

export function AppSidebar() {
  const { label, href, icon: SettingsIcon } = WORKSPACE_SETTINGS_ITEM;

  return (
    <aside className="flex w-14 shrink-0 flex-col items-center gap-3 bg-sidebar py-3">
      <Link href={WORKSPACE_PATH} aria-label="Tomato">
        <Image src="/logo.svg" alt="" width={36} height={36} priority />
      </Link>
      <SidebarNav />
      <div className="mt-auto flex flex-col items-center gap-2">
        <button type="button" aria-label="Account" className={ROUND_CLASS}>
          <UserIcon className="size-5" strokeWidth={1.75} />
        </button>
        <Link href={href} title={label} aria-label={label} className={ROUND_CLASS}>
          <SettingsIcon className="size-5" strokeWidth={1.75} />
        </Link>
      </div>
    </aside>
  );
}
