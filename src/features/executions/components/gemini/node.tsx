"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { GeminiFormValues, GeminiDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGeminiRealtimeToken } from "./action";
import { AVAILABLE_MODELS } from "./dialog";
import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini";

type GeminiNodeData = {
  variableName?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt?: string;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GEMINI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchGeminiRealtimeToken,
  });

  const handleSettings = () => setDialogOpen(true);

  const handleSubmit = (values: GeminiFormValues) => {
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
      <GeminiDialog
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={"/logos/gemini.svg"}
        name="Gemini"
        description={description}
        onDoubleClick={handleSettings}
        onSettings={handleSettings}
        status={nodeStatus}
      />
    </>
  );
});

GeminiNode.displayName = "GeminiNode";
