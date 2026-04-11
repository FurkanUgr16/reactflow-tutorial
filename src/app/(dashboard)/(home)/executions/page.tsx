import {
  ExecuitonLoading,
  ExecutionError,
  ExecutionsContainer,
  ExecutionsList,
} from "@/features/executions/components/executions";
import { executionsParmasLoader } from "@/features/executions/server/params-loader";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
import { HydrateClient } from "@/trpc/server";

import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searhParams: Promise<SearchParams>;
};

const Execuitons = async ({ searhParams }: Props) => {
  const params = await executionsParmasLoader(searhParams);
  prefetchExecutions(params);

  return (
    <ExecutionsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<ExecutionError />}>
          <Suspense fallback={<ExecuitonLoading />}>
            <ExecutionsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </ExecutionsContainer>
  );
};

export default Execuitons;
