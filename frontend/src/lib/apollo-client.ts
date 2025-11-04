import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const DEFAULT_GRAPHQL_URL = "https://item-management-system.onrender.com/graphql";

const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? DEFAULT_GRAPHQL_URL;

if (!graphqlUrl.startsWith("http")) {
  throw new Error(`Invalid GraphQL URL baked into bundle: ${graphqlUrl}`);
}
console.log("Apollo GraphQL URL =>", graphqlUrl);

export const createApolloClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: graphqlUrl,
    }),
  });
