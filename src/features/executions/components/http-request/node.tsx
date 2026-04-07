"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { FormValues, HTTPRequestDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchHttpRequestRealtimeToken } from "./action";
import {
  HTTP_REQUEST_CHANNEL_NAME,
  httpRequestChannel,
} from "@/inngest/channels/http-request";

type HTTPRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: "string";
  variableName?: string;
};

type HTTPRequestNodeType = Node<HTTPRequestNodeData>;

export const HTTPRequestNode = memo((props: NodeProps<HTTPRequestNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeData = props.data;
  const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : "Not configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: HTTP_REQUEST_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchHttpRequestRealtimeToken,
  });

  const handleSettings = () => setDialogOpen(true);

  const handleSubmit = (values: FormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };

  return (
    <>
      <HTTPRequestDialog
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        onDoubleClick={handleSettings}
        onSettings={handleSettings}
        status={nodeStatus}
      />
    </>
  );
});

HTTPRequestNode.displayName = "HTTPRequestNode";
