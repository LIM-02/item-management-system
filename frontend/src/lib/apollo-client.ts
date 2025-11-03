import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const DEFAULT_GRAPHQL_URL = "http://localhost:3001/graphql";

const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? DEFAULT_GRAPHQL_URL;

export const createApolloClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: graphqlUrl,
    }),
  });
