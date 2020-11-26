import gql from "graphql-tag";

export const LUMIN_QUERY = gql`
  query productQuery($currency: Currency) {
    products {
      id
      image_url
      title
      price(currency: $currency)
    }
    currency
  }
`;
// export const LUMIN_PRODUCTS = gql`
//   query productQuery($currency: Currency) {
//     products {
//       id
//       image_url
//       title
//       price(currency: $currency)
//     }
//   }
// `;
// export const LUMIN_CURRENCIES = gql`
//   query currencyQuery {
//     currency
//   }
// `;
