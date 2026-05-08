import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';

export const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

export function createApolloClient(token?: string) {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: graphqlUrl,
      headers: token ? { authorization: `Bearer ${token}` } : undefined
    }),
    cache: new InMemoryCache()
  });
}

export const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    id
    name
    slug
    category
    description
    monthlyRent
    deposit
    tenureOptions
    inventoryCount
    imageUrl
  }
`;

export const PRODUCTS_QUERY = gql`
  ${PRODUCT_FIELDS}
  query Products($filter: ProductFilterInput) {
    products(filter: $filter) {
      items {
        ...ProductFields
      }
      total
      page
      limit
    }
  }
`;

export const PRODUCT_QUERY = gql`
  ${PRODUCT_FIELDS}
  query Product($slug: String!) {
    product(slug: $slug) {
      ...ProductFields
    }
  }
`;
