import {
  CredentialsList,
  CredentialsContainer,
  CredentialError,
  CredentialLoading,
} from "@/features/credentials/components/credentials";
import { credentialParmasLoader } from "@/features/credentials/server/params-loader";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { HydrateClient } from "@/trpc/server";

import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searhParams: Promise<SearchParams>;
};

const Credentials = async ({ searhParams }: Props) => {
  const params = await credentialParmasLoader(searhParams);
  prefetchCredentials(params);

  return (
    <CredentialsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<CredentialError />}>
          <Suspense fallback={<CredentialLoading />}>
            <CredentialsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialsContainer>
  );
};

export default Credentials;
