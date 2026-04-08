import type { NodeExecutor } from "@/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

type GoogleFormTriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor: NodeExecutor<
  GoogleFormTriggerData
> = async ({ data, nodeId, context, step, publish }) => {
  // TODO publish loading state for manual trigger
  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  const result = await step.run("google-form-trigger", async () => context);

  // todo publish success state for manual trigger
  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: "success",
    }),
  );

  return result;
};
