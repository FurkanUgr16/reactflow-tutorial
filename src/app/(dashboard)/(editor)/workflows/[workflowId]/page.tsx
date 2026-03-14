import React from "react";

type PageProps = {
  params: Promise<{
    workflowId: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { workflowId } = await params;
  return <div>workflow id: {workflowId}</div>;
};

export default Page;
