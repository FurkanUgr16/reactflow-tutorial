type PageProps = {
  params: Promise<{
    credentialId: string;
  }>;
};

const CredentialID = async ({ params }: PageProps) => {
  const { credentialId } = await params;
  return <div>credentialId: {credentialId}</div>;
};

export default CredentialID;
