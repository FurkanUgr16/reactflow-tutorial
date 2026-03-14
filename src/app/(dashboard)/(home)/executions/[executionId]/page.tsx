import React from "react";

type PageProps = {
  params: Promise<{
    executionId: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { executionId } = await params;

  return <div>execution id: {executionId}</div>;
};

export default Page;
