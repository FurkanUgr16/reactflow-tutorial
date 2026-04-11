"use client";
import React from "react";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionParams } from "../hooks/use-executions-params";
import type { Execution } from "@/generated/prisma/client";
import { ExecutionStatus } from "@/generated/prisma/enums";
import { formatDistanceToNow } from "date-fns";

import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";

export const ExecutionsList = () => {
  const { data: executions } = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.items}
      getKey={(execution) => execution.id}
      emptyView={<ExecutionEmpty />}
      renderItem={(execution) => <ExecutionItem data={execution} />}
    />
  );
};

//header
export const ExecutionHeaders = () => {
  return (
    <EntityHeader
      title="Executions"
      description="View your workflow execution history"
    />
  );
};

// pagination
export const ExecutionsPagination = () => {
  const {
    data: { page, totalPages },
    isFetching,
  } = useSuspenseExecutions();
  const [params, setParams] = useExecutionParams();
  return (
    <EntityPagination
      disabled={isFetching}
      page={page}
      totalPages={totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

// container
export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionHeaders />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

// loading
export const ExecuitonLoading = () => {
  return <LoadingView message="Loading execution..." />;
};

// error
export const ExecutionError = () => {
  return <ErrorView message="Error loading execution" />;
};

// empty
export const ExecutionEmpty = () => {
  return (
    <EmptyView message="You haven't any executions yet. Get started by running your first workflow" />
  );
};

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />;

    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-primary animate-spin" />;

    default:
      return <ClockIcon className="size-5 text-muted-foreground" />;
  }
};

const formatStatus = (status: ExecutionStatus) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

export const ExecutionItem = ({
  data,
}: {
  data: Execution & {
    workflow: {
      id: string;
      name: string;
    };
  };
}) => {
  const duration = data.completedAt
    ? Math.round(
        (new Date(data.completedAt).getTime() -
          new Date(data.startedAt).getTime()) /
          1000,
      )
    : null;

  const subtitle = (
    <>
      {data.workflow.name} &bull; Started{" "}
      {formatDistanceToNow(data.startedAt, { addSuffix: true })}{" "}
      {duration !== null && <>&bull; Took {duration}s</>}
    </>
  );

  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={formatStatus(data.status)}
      subtitle={subtitle}
      image={
        <div className="size-8 flex items-center justify-between">
          {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};
