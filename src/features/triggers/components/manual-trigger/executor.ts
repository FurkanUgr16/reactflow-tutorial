import type { NodeExecutor } from "@/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

type ManualTriggerDara = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerDara> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  // TODO publish loading state for manual trigger
  await publish(
    manualTriggerChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  const result = await step.run("manual-trigger", async () => context);

  // todo publish success state for manual trigger
  await publish(
    manualTriggerChannel().status({
      nodeId,
      status: "success",
    }),
  );

  return result;
};
