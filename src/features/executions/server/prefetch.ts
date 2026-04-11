import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.execuitons.getMany>;

// prefetch all executions
export const prefetchExecutions = (params: Input) => {
  return prefetch(trpc.execuitons.getMany.queryOptions(params));
};

// prefetch one execution
export const prefetchExecution = (id: string) => {
  return prefetch(trpc.execuitons.getOne.queryOptions({ id }));
};
