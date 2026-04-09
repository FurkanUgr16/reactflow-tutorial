"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { OpenAIValues, OpenAIDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchOpenAIRealtimeToken } from "./action";
import { AVAILABLE_MODELS } from "./dialog";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";

type OpenAINodeData = {
  variableName?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt?: string;
};

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: OPENAI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchOpenAIRealtimeToken,
  });

  const handleSettings = () => setDialogOpen(true);

  const handleSubmit = (values: OpenAIValues) => {
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
      <OpenAIDialog
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={"/logos/openai.svg"}
        name="Open AI"
        description={description}
        onDoubleClick={handleSettings}
        onSettings={handleSettings}
        status={nodeStatus}
      />
    </>
  );
});

OpenAINode.displayName = "OpenAINode";
