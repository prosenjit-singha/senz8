import {
  GetCustomerDocument,
  GetCustomerQuery,
  GetCustomerQueryVariables,
  UpdateCustomerDocument,
  UpdateCustomerMutation,
  UpdateCustomerMutationVariables,
} from "@/graphql";
import { storefrontGraphQlRequest } from "@/graphql/shopify";
import { apiHandler } from "@/helpers/api.handler";

export const GET = apiHandler(
  {
    validateSession: true,
    errorMsg: "Failed to fetch customer details",
    successMsg: "Customer details fetched successfully",
  },
  async ({ session }) => {
    const result = await storefrontGraphQlRequest<
      GetCustomerQuery,
      GetCustomerQueryVariables
    >(GetCustomerDocument, { customerAccessToken: session.accessToken });

    if (result.customer) {
      return {
        success: true,
        statusCode: 200,
        data: result.customer,
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
  }
);

export const POST = apiHandler(
  {
    validateSession: true,
    errorMsg: "Failed to update customer details",
    successMsg: "Customer details updated successfully",
  },
  async ({ session, req }) => {
    const body = await req.json();

    const result = await storefrontGraphQlRequest<
      UpdateCustomerMutation,
      UpdateCustomerMutationVariables
    >(UpdateCustomerDocument, {
      customerAccessToken: session.accessToken,
      customer: body,
    });

    if (result.customerUpdate?.customer) {
      return {
        success: true,
        statusCode: 200,
        data: result.customerUpdate.customer,
      };
    }

    return {
      success: false,
      statusCode: 404,
      error: {
        type: "bad-request",
        message: "Failed to update customer details",
        data: result.customerUpdate?.customerUserErrors,
      },
    };
  }
);
