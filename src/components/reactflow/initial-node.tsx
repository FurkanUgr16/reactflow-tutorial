"use client";

import type { NodeProps } from "@xyflow/react";
import { Plus } from "lucide-react";
import { memo } from "react";
import { PlaceholderNode } from "./placeholder-node";
import WorkflowNode from "../workflow-node";

export const InitialNode = memo((props: NodeProps) => {
  return (
    <WorkflowNode showToolBar={false}>
      <PlaceholderNode {...props}>
        <div className="cursor-pointer flex items-center justify-center">
          <Plus className="size-4" />
        </div>
      </PlaceholderNode>
    </WorkflowNode>
  );
});

InitialNode.displayName = "InitialNode";
