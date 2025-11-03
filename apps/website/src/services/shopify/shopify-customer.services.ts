import "server-only";
import {
  CustomerRecoverDocument,
  CustomerRecoverMutation,
  CustomerRecoverMutationVariables,
  CustomerResetByUrlDocument,
  CustomerResetByUrlMutation,
  CustomerResetByUrlMutationVariables,
  CustomerResetDocument,
  CustomerResetMutation,
  CustomerResetMutationVariables,
} from "@/graphql";
import { storefrontGraphQlRequest } from "@/graphql/shopify";
import { shopifyGraphQlApi } from "@/lib/shopify/shopify.admin";
import {
  CustomerInput,
  zCustomerInputSchema,
} from "@/zod-schemas/shopify/customer.z";

export const createShopifyCustomer = async (data: CustomerInput) => {
  const input = zCustomerInputSchema.parse(data);

  const mutation = `
          mutation customerCreate($input: CustomerInput!) {
            customerCreate(input: $input) {
              userErrors {
                field
                message
              }
              customer {
                id
                email
                phone
                firstName
                lastName
                taxExempt
                tags
                note
                createdAt
                updatedAt
                amountSpent {
                  amount
                  currencyCode
                }
                smsMarketingConsent {
                  marketingState
                  marketingOptInLevel
                  consentUpdatedAt
                }
                emailMarketingConsent {
                  marketingState
                  marketingOptInLevel
                  consentUpdatedAt
                }
              }
            }
          }
        `;

  return await shopifyGraphQlApi<{ data: any }>({
    query: mutation,
    variables: { input },
  });
};

export const recoverCustomer = async (
  data: CustomerRecoverMutationVariables
) => {
  const result = await storefrontGraphQlRequest<
    CustomerRecoverMutation,
    CustomerRecoverMutationVariables
  >(CustomerRecoverDocument, data);
  return result.customerRecover;
};

export const resetPassword = async (data: CustomerResetMutationVariables) => {
  const result = await storefrontGraphQlRequest<
    CustomerResetMutation,
    CustomerResetMutationVariables
  >(CustomerResetDocument, data);
  return result.customerReset;
};

export const resetPasswordByURL = async (
  data: CustomerResetByUrlMutationVariables
) => {
  const result = await storefrontGraphQlRequest<
    CustomerResetByUrlMutation,
    CustomerResetByUrlMutationVariables
  >(CustomerResetByUrlDocument, data);
  return result.customerResetByUrl;
};
