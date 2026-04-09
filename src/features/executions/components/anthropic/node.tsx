"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { AnthropicDialog, AnthropicValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { AVAILABLE_MODELS } from "./dialog";
import { fetchAnthropicRealtimeToken } from "./action";
import { ANTHROPIC_CHANNEL_NAME } from "@/inngest/channels/anthropic";

type AnthropicNodeData = {
  variableName?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt?: string;
};

type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: ANTHROPIC_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchAnthropicRealtimeToken,
  });

  const handleSettings = () => setDialogOpen(true);

  const handleSubmit = (values: AnthropicValues) => {
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
      <AnthropicDialog
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={"/logos/anthropic.svg"}
        name="Anthropic"
        description={description}
        onDoubleClick={handleSettings}
        onSettings={handleSettings}
        status={nodeStatus}
      />
    </>
  );
});

AnthropicNode.displayName = "AnthropicNode";
