"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";

type HTTPRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: "string";
  [key: string]: unknown;
};

type HTTPRequestNodeType = Node<HTTPRequestNodeData>;

export const HTTPRequestNode = memo((props: NodeProps<HTTPRequestNodeType>) => {
  const nodeData = props.data as HTTPRequestNodeData;
  const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"}`
    : "Not configured";

  return (
    <>
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        onDoubleClick={() => {}}
        onSettings={() => {}}
      />
    </>
  );
});

HTTPRequestNode.displayName = "HTTPRequestNode";
