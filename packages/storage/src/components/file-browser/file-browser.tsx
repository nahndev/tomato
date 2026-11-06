import { cn } from "@tomato/ui";
import type { StorageFile } from "@tomato/types";
import { useState } from "react";
import type { StorageApi } from "../../storage.api";
import { DEFAULT_FILE_BROWSER_LABELS } from "../../storage.constants";
import type { FileBrowserGroup, FileBrowserOptions } from "../../storage.types";
import { getGroupKey, GroupSidebar } from "./group-sidebar";
import { ResourceContent } from "./resource-content";

export interface FileBrowserProps {
  api: StorageApi;
  /** The sidebar is shown only with several groups. */
  groups: FileBrowserGroup[];
  /** Files selected when the browser opens or when `value` changes. */
  value?: StorageFile[];
  /** Called only by the submit button. Without it, nothing can be selected. */
  onChangeValue?: (files: StorageFile[]) => void | Promise<void>;
  options?: FileBrowserOptions;
  className?: string;
}

export function FileBrowser({
  api,
  groups,
  value,
  onChangeValue,
  options,
  className,
}: FileBrowserProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const activeGroup =
    groups.find((group) => getGroupKey(group) === activeKey) ?? groups[0];
  if (!activeGroup) return null;

  const activeGroupKey = getGroupKey(activeGroup);

  return (
    <div className={cn("flex min-h-0 gap-3", className)}>
      {groups.length > 1 && (
        <GroupSidebar
          groups={groups}
          activeKey={activeGroupKey}
          label={options?.groups ?? DEFAULT_FILE_BROWSER_LABELS.groups}
          onSelect={setActiveKey}
        />
      )}
      {/* The key resets the opened folder, search and selection per group. */}
      <ResourceContent
        key={activeGroupKey}
        className="min-w-0 flex-1"
        api={api}
        owner={activeGroup}
        value={value}
        onChangeValue={onChangeValue}
        options={options}
      />
    </div>
  );
}
