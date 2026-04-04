import type { NodeExecutor } from "@/features/executions/types";

type ManualTriggerDara = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerDara> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  // TODO publish loading state for manual trigger

  const result = await step.run("manual-trigger", async () => context);

  // todo publish success state for manual trigger

  return result;
};
