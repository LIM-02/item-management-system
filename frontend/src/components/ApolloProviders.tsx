"use client";

import { ApolloProvider } from "@apollo/client/react";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";

import { createApolloClient } from "@/lib/apollo-client";

const ApolloProviders = ({ children }: PropsWithChildren<object>) => {
  const client = useMemo(() => createApolloClient(), []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviders;
