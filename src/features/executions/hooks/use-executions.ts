import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useExecutionParams } from "./use-executions-params";

// Hook the fetch all credentils using suspense
export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionParams();
  return useSuspenseQuery(trpc.execuitons.getMany.queryOptions(params));
};

// suspense one credential
export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.execuitons.getOne.queryOptions({ id }));
};
