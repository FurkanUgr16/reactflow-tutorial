"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import LogoutButton from "@/features/auth/components/logout-button";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Page() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.getWorkflow.queryOptions());
  const queryClient = useQueryClient();
  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        toast.success("jobs queued");
      },
    }),
  );

  const testAi = useMutation(trpc.testai.mutationOptions());

  return (
    <div className="min-h-screen min-w-screen gap-4 flex flex-col gap-y-6 items-center justify-center">
      <div className="flex flex-col gap-y-6 items-center">
        {JSON.stringify(data, null, 2)}
      </div>

      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create workflow
      </Button>

      <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
        Test AI
      </Button>

      <LogoutButton />
    </div>
  );
}
