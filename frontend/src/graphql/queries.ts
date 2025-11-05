import { gql } from "@apollo/client";

export const GET_ITEMS = gql`
  query GetItems($search: String, $category: String, $favoritesOnly: Boolean) {
    items(search: $search, category: $category, favoritesOnly: $favoritesOnly) {
      id
      name
      category
      price
      favorite
      createdAt
      updatedAt
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories
  }
`;

export const CREATE_ITEM = gql`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      item {
        id
        name
        category
        price
        favorite
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const UPDATE_ITEM = gql`
  mutation UpdateItem($input: UpdateItemInput!) {
    updateItem(input: $input) {
      item {
        id
        name
        category
        price
        favorite
        createdAt
        updatedAt
      }
      errors
    }
  }
`;
