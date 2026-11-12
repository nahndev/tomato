"use client";

import {
  cn,
  ScrollArea,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@tomato/ui";
import { ChevronRightIcon, FileTextIcon, Link2Icon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSubmissionGraph } from "../hooks/use-submission-graph";
import {
  getSubmissionPath,
  SUBMISSION_GRAPH_SKELETON_ROWS,
  SUBMISSION_SHORT_ID_LENGTH,
  SubmissionTreeNodeKind,
} from "../submission.constants";
import type { SubmissionTreeNode } from "../submission.types";
import { Graph } from "../utils/graph";

interface SubmissionGraphProps {
  value: string;
}

export function SubmissionGraph({ value }: SubmissionGraphProps) {
  const { data: graph, isLoading, isError } = useSubmissionGraph(value);
  const tree = useMemo(() => (graph ? new Graph(graph).toTree() : []), [graph]);

  return (
    <ScrollArea className="min-h-0 flex-1 [&_[data-slot=scroll-area-viewport]>div]:block!">
      <nav aria-label="Dependencies" className="p-2">
        {isLoading ? (
          <SubmissionGraphSkeleton />
        ) : isError ? (
          <p className="px-2 py-1 text-sm text-muted-foreground">Failed to load dependencies.</p>
        ) : (
          <TooltipProvider delayDuration={400}>
            <SubmissionTreeList nodes={tree} value={value} />
          </TooltipProvider>
        )}
      </nav>
    </ScrollArea>
  );
}

function SubmissionGraphSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-2 py-1">
      {Array.from({ length: SUBMISSION_GRAPH_SKELETON_ROWS }, (_, index) => (
        <Skeleton key={index} className="h-5" style={{ marginLeft: (index % 3) * 16 }} />
      ))}
    </div>
  );
}

interface SubmissionTreeListProps {
  nodes: SubmissionTreeNode[];
  value: string;
  className?: string;
}

function SubmissionTreeList({ nodes, value, className }: SubmissionTreeListProps) {
  return (
    <ul className={cn("flex flex-col gap-0.5", className)}>
      {nodes.map((node) => (
        <SubmissionTreeItem key={node.edge?.id ?? node.id} node={node} value={value} />
      ))}
    </ul>
  );
}

interface SubmissionTreeItemProps {
  node: SubmissionTreeNode;
  value: string;
}

function SubmissionTreeItem({ node, value }: SubmissionTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isRefer = node.kind === SubmissionTreeNodeKind.REFER;
  const hasChildren = node.children.length > 0;
  const Icon = isRefer ? Link2Icon : FileTextIcon;

  return (
    <li>
      <div className="flex items-center">
        {hasChildren ? (
          <button
            type="button"
            aria-label={isExpanded ? "Collapse" : "Expand"}
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((current) => !current)}
            className="flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ChevronRightIcon className={cn("size-3.5 transition-transform", isExpanded && "rotate-90")} />
          </button>
        ) : (
          <span className="size-6 shrink-0" />
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={getSubmissionPath(node.id)}
              aria-current={node.id === value ? "page" : undefined}
              className="variant-ghost flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md px-2 text-sm not-aria-[current=page]:text-foreground aria-[current=page]:font-medium"
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.75} />
              <span className="truncate font-mono text-xs">{node.id.slice(-SUBMISSION_SHORT_ID_LENGTH)}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-0.5">
            <span className="font-mono">{node.id}</span>
            {node.edge && <span className="text-background/70">Dependency: {node.edge.type}</span>}
            {isRefer && <span className="text-background/70">Already shown in the tree</span>}
          </TooltipContent>
        </Tooltip>
      </div>
      {hasChildren && isExpanded && (
        <SubmissionTreeList nodes={node.children} value={value} className="mt-0.5 ml-3 border-l border-border pl-1.5" />
      )}
    </li>
  );
}
