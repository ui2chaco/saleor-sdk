import gql from "graphql-tag";

import {
  checkoutFragment,
  checkoutProductVariantFragment,
} from "../fragments/checkout";

export const checkoutDetails = gql`
  ${checkoutFragment}
  query CheckoutDetails($token: UUID!) {
    checkout(token: $token) {
      ...Checkout
    }
  }
`;

export const userCheckoutTokenList = gql`
  query UserCheckoutTokenList($channel: String) {
    me {
      id
      checkoutTokens(channel: $channel)
    }
  }
`;

export const checkoutProductVariants = gql`
  ${checkoutProductVariantFragment}
  query CheckoutProductVariants($ids: [ID], $channel: String) {
    productVariants(ids: $ids, first: 100, channel: $channel) {
      edges {
        node {
          ...ProductVariant
        }
      }
    }
  }
`;

export const checkoutProductVariantsRelay = gql`
  query addCartList($variantId: Int) {
    product_productvariant_connection(where: { id: { _eq: $variantId } }) {
      edges {
        node {
          id
          name
          price_amount
          sku
          track_inventory
          currency
          product_product {
            id
            name
            product_producttype {
              id
              is_shipping_required
              product_attributevariants {
                product_attribute {
                  id
                  name
                  product_attributevalues {
                    id
                    name
                  }
                }
              }
            }
            product_productimages {
              id
              image
              alt
            }
          }
        }
      }
    }
  }
`;
