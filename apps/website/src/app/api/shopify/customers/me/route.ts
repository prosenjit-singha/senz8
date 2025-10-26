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
import { getSession } from "@/lib/auth/auth.session";

export const GET = apiHandler(async () => {
  const session = await getSession();

  if (!session?.accessToken) {
    return {
      success: false,
      statusCode: 401,
      message: "Failed to fetch customer details",
      data: null,
      error: {
        type: "authorization",
        message: "Unauthorized request",
        data: null,
      },
    };
  }

  const result = await storefrontGraphQlRequest<
    GetCustomerQuery,
    GetCustomerQueryVariables
  >(GetCustomerDocument, { customerAccessToken: session.accessToken });

  if (result.customer) {
    return {
      success: true,
      statusCode: 200,
      message: "Customer details fetched successfully",
      data: result.customer,
      error: null,
    };
  }

  return {
    success: false,
    statusCode: 404,
    message: "Customer not found",
    data: null,
    error: {
      type: "bad-request",
      message: "Customer not found",
      data: null,
    },
  };
});

export const POST = apiHandler(async (req) => {
  const session = await getSession();

  if (!session?.accessToken) {
    return {
      success: false,
      statusCode: 401,
      message: "Failed to fetch customer details",
      data: null,
      error: {
        type: "authorization",
        message: "Unauthorized request",
        data: null,
      },
    };
  }

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
      message: "Customer details updated successfully",
      data: result.customerUpdate.customer,
      error: null,
    };
  }

  return {
    success: false,
    statusCode: 404,
    message: "Failed to update customer details",
    data: null,
    error: {
      type: "bad-request",
      message: "Failed to update customer details",
      data: result.customerUpdate?.customerUserErrors,
    },
  };
});
