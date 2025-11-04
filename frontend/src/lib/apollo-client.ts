// src/lib/apollo-client.ts
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const PROD_URL = "https://item-management-system-f5bd.onrender.com/graphql";
const url = process.env.NEXT_PUBLIC_GRAPHQL_URL || PROD_URL;

console.log("BUNDLED NEXT_PUBLIC_GRAPHQL_URL =", url);
if (!/^https?:\/\/.+\/graphql$/.test(url)) {
  throw new Error(`Invalid NEXT_PUBLIC_GRAPHQL_URL: ${url}`);
}

export const createApolloClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: url }),
  });
