import { shopifyGraphQlApi } from "@/lib/shopify/shopify.admin";
import { CustomerInput, zCustomerInputSchema } from "@/zod-schemas/shopify/customer.z";

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
