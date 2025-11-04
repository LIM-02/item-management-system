import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const FALLBACK_RENDER_URL = "https://item-management-system-f5bd.onrender.com/graphql";
const FALLBACK_LOCAL_URL = "http://localhost:3001/graphql";

const defaultUrl = process.env.NODE_ENV === "production" ? FALLBACK_RENDER_URL : FALLBACK_LOCAL_URL;
const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL?.trim() || defaultUrl;

export const createApolloClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: graphqlUrl,
    }),
  });
