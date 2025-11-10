import z from "zod";
import { apiHandler } from "@/helpers/api.handler";
import { storefrontGraphQlRequest } from "@/graphql/shopify";
import {
  CreateCustomerAccessTokenDocument,
  CreateCustomerAccessTokenMutation,
  CreateCustomerAccessTokenMutationVariables,
  GetCustomerDocument,
  GetCustomerQuery,
  GetCustomerQueryVariables,
} from "@/graphql";
const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const POST = apiHandler(
  {
    successMsg: "Customer signed in successfully",
    errorMsg: "Failed to sign in customer",
  },
  async ({ req }) => {
    const body = await req.json();
    const input = schema.parse(body);
    const { customerAccessTokenCreate } = await storefrontGraphQlRequest<
      CreateCustomerAccessTokenMutation,
      CreateCustomerAccessTokenMutationVariables
    >(CreateCustomerAccessTokenDocument, {
      input,
    });

    if (customerAccessTokenCreate?.customerAccessToken) {
      const customer = await storefrontGraphQlRequest<
        GetCustomerQuery,
        GetCustomerQueryVariables
      >(GetCustomerDocument, {
        customerAccessToken:
          customerAccessTokenCreate.customerAccessToken.accessToken,
      });

      if (customer.customer) {
        return {
          success: true,
          statusCode: 200,
          data: {
            customer: customer.customer,
            token: {
              accessToken:
                customerAccessTokenCreate.customerAccessToken.accessToken,
              expiresAt:
                customerAccessTokenCreate.customerAccessToken.expiresAt,
            },
          },
        };
      }

      return {
        success: false,
        statusCode: 404,
        error: {
          type: "bad-request",
          message: "Customer not found",
          data: null,
        },
      };
    } else {
      return {
        success: false,
        statusCode: 400,
        error: {
          type: "authentication",
          message: "Invalid email or password",
          data: customerAccessTokenCreate?.customerUserErrors,
        },
      };
    }
  }
);
