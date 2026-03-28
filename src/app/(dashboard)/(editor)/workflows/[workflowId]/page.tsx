import {
  EditorLoading,
  Editor,
  EditorError,
} from "@/features/editor/components/editor";
import EditorHeader from "@/features/editor/components/editor-header";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type PageProps = {
  params: Promise<{
    workflowId: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { workflowId } = await params;
  prefetchWorkflow(workflowId);
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <EditorHeader workflowId={workflowId} />
          <main className="flex-1">
            <Editor workflowId={workflowId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
