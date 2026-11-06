"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  cn,
} from "@tomato/ui";
import { Fragment } from "react";
import type { FileBrowserItem } from "../../file.types";
import type { FileBrowserDropTargetProps } from "../../hooks/use-file-browser-drag";
import { DROP_TARGET_CLASS } from "./file-browser.constants";

interface FileBrowserBreadcrumbProps {
  rootLabel: string;
  folderPath: FileBrowserItem[];
  dropTargetId: string | null | undefined;
  getDropTargetProps: (targetId: string | null) => FileBrowserDropTargetProps;
  onNavigate: (folderId: string | null) => void;
}

export function FileBrowserBreadcrumb({
  rootLabel,
  folderPath,
  dropTargetId,
  getDropTargetProps,
  onNavigate,
}: FileBrowserBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {[null, ...folderPath].map((folder, index) => {
          const targetId = folder?.id ?? null;
          const name = folder?.name ?? rootLabel;
          const isCurrent = index === folderPath.length;
          return (
            <Fragment key={targetId ?? "root"}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem
                {...getDropTargetProps(targetId)}
                className={cn(
                  "rounded-sm px-1",
                  dropTargetId === targetId && DROP_TARGET_CLASS,
                )}
              >
                {isCurrent ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <button type="button" onClick={() => onNavigate(targetId)}>
                      {name}
                    </button>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
