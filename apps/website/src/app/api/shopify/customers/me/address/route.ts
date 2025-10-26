import {
  CustomerAddressCreateDocument,
  CustomerAddressCreateMutation,
  CustomerAddressCreateMutationVariables,
  CustomerAddressDeleteDocument,
  CustomerAddressDeleteMutation,
  CustomerAddressDeleteMutationVariables,
  CustomerAddressUpdateDocument,
  CustomerAddressUpdateMutation,
  CustomerAddressUpdateMutationVariables,
  CustomerDefaultAddressUpdateDocument,
  CustomerDefaultAddressUpdateMutation,
  CustomerDefaultAddressUpdateMutationVariables,
} from "@/graphql";
import { storefrontGraphQlRequest } from "@/graphql/shopify";
import { apiHandler } from "@/helpers/api.handler";

// add address
export const PUT = apiHandler(async (req, session) => {
  if (!session) {
    return {
      success: false,
      message: "Failed to add address",
      error: {
        type: "authentication",
        message: "Unauthorized",
        data: null,
      },
      statusCode: 401,
      data: null,
    };
  }

  const body = await req.json();

  const result = await storefrontGraphQlRequest<
    CustomerAddressCreateMutation,
    CustomerAddressCreateMutationVariables
  >(CustomerAddressCreateDocument, {
    customerAccessToken: session.accessToken,
    address: body,
  });

  if (result.customerAddressCreate?.customerAddress) {
    return {
      success: true,
      message: "Address added successfully",
      statusCode: 201,
      data: result.customerAddressCreate?.customerAddress,
      error: null,
    };
  }

  return {
    success: false,
    message: "Failed to add address",
    error: {
      type: "internal-server-error",
      message: "Internal server error occurred!",
      data: result.customerAddressCreate?.customerUserErrors,
    },
    statusCode: 400,
    data: null,
  };
});

// update address
export const PATCH = apiHandler(async (req, session) => {
  if (!session) {
    return {
      success: false,
      message: "Failed to update address",
      error: {
        type: "authentication",
        message: "Unauthorized",
        data: null,
      },
      statusCode: 401,
      data: null,
    };
  }

  const { id, ...body } = await req.json();

  const result = await storefrontGraphQlRequest<
    CustomerAddressUpdateMutation,
    CustomerAddressUpdateMutationVariables
  >(CustomerAddressUpdateDocument, {
    customerAccessToken: session.accessToken,
    id,
    address: body,
  });

  if (result.customerAddressUpdate?.customerAddress) {
    return {
      success: true,
      message: "Address updated successfully",
      statusCode: 200,
      data: result.customerAddressUpdate?.customerAddress,
      error: null,
    };
  }

  return {
    success: false,
    message: "Failed to update address",
    error: {
      type: "bad-request",
      message: "Bad request!",
      data: result.customerAddressUpdate?.customerUserErrors,
    },
    statusCode: 400,
    data: null,
  };
});

// delete address
export const DELETE = apiHandler(async (req, session) => {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return {
      success: false,
      message: "Failed to delete address",
      error: {
        type: "bad-request",
        message: "id is required in query params",
        data: null,
      },
      statusCode: 400,
      data: null,
    };
  }

  if (!session) {
    return {
      success: false,
      message: "Failed to delete address",
      error: {
        type: "authentication",
        message: "Unauthorized",
        data: null,
      },
      statusCode: 401,
      data: null,
    };
  }

  const result = await storefrontGraphQlRequest<
    CustomerAddressDeleteMutation,
    CustomerAddressDeleteMutationVariables
  >(CustomerAddressDeleteDocument, {
    customerAccessToken: session.accessToken,
    id,
  });

  if (result.customerAddressDelete?.deletedCustomerAddressId) {
    return {
      success: true,
      message: "Address deleted successfully",
      statusCode: 200,
      data: result.customerAddressDelete?.deletedCustomerAddressId,
      error: null,
    };
  }

  return {
    success: false,
    message: "Failed to delete address",
    error: {
      type: "bad-request",
      message: "Bad request!",
      data: result.customerAddressDelete?.customerUserErrors,
    },
    statusCode: 400,
    data: null,
  };
});

// update default address
export const POST = apiHandler(async (req, session) => {
  if (!session) {
    return {
      success: false,
      message: "Failed to update default address",
      error: {
        type: "authentication",
        message: "Unauthorized",
        data: null,
      },
      statusCode: 401,
      data: null,
    };
  }

  const { addressId } = await req.json();

  const result = await storefrontGraphQlRequest<
    CustomerDefaultAddressUpdateMutation,
    CustomerDefaultAddressUpdateMutationVariables
  >(CustomerDefaultAddressUpdateDocument, {
    customerAccessToken: session.accessToken,
    addressId,
  });

  if (result.customerDefaultAddressUpdate?.customer) {
    return {
      success: true,
      message: "Default address updated successfully",
      statusCode: 200,
      data: result.customerDefaultAddressUpdate?.customer,
      error: null,
    };
  }

  return {
    success: false,
    message: "Failed to update default address",
    error: {
      type: "bad-request",
      message: "Bad request!",
      data: result.customerDefaultAddressUpdate?.customerUserErrors,
    },
    statusCode: 400,
    data: null,
  };
});
