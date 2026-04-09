import type { NodeExecutor } from "@/features/executions/types";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

type StripeTriggerData = Record<string, unknown>;

export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  // TODO publish loading state for manual trigger
  await publish(
    stripeTriggerChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  const result = await step.run("stripe-trigger", async () => context);

  // todo publish success state for manual trigger
  await publish(
    stripeTriggerChannel().status({
      nodeId,
      status: "success",
    }),
  );

  return result;
};
