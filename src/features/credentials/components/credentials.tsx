"use client";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import React from "react";
import { useRouter } from "next/navigation";
import { useCredentialParams } from "../hooks/use-credentials-params";
import useEntitySearch from "@/hooks/use-entity-search";
import { Credential } from "@/generated/prisma/client";
import { CredentialType } from "@/generated/prisma/enums";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search credentials"
    />
  );
};

export const CredentialsList = () => {
  const { data: credentials } = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.items}
      getKey={(credential) => credential.id}
      emptyView={<CredendialsEmpty />}
      renderItem={(credential) => <CredentialItem data={credential} />}
    />
  );
};

//header
export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();

  return (
    <EntityHeader
      title="Credentials"
      description="Create and manage your credentials"
      newButtonHref={"/credentials/new"}
      newButtonLabel="New crendential"
      disabled={disabled}
    />
  );
};

// pagination
export const CredentialPagination = () => {
  const {
    data: { page, totalPages },
    isFetching,
  } = useSuspenseCredentials();
  const [params, setParams] = useCredentialParams();
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
export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialPagination />}
    >
      {children}
    </EntityContainer>
  );
};

// loading
export const CredentialLoading = () => {
  return <LoadingView message="Loading credential..." />;
};

// error
export const CredentialError = () => {
  return <ErrorView message="Error loading credential" />;
};

// empty
export const CredendialsEmpty = () => {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/credentials/new");
  };

  return (
    <EmptyView
      onNew={handleCreate}
      message="You haven't any credentials yet. Get started by creating your first credential"
    />
  );
};

const credentialLogos: Record<CredentialType, string> = {
  [CredentialType.OPENAI]: "/logos/openai.svg",
  [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
  [CredentialType.GEMINI]: "/logos/gemini.svg",
};

export const CredentialItem = ({ data }: { data: Credential }) => {
  const { mutateAsync: removeCredential, isPending } = useRemoveCredential();

  const handleRemove = () => {
    removeCredential({ id: data.id });
  };

  const logo = credentialLogos[data.type] || "logos/openai.svg";

  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-between">
          <Image src={logo} alt={data.type} width={20} height={20} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={isPending}
    />
  );
};
