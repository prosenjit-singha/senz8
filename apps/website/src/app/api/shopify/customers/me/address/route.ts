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
export const PUT = apiHandler(
  {
    validateSession: true,
    errorMsg: "Failed to add address",
    successMsg: "Address added successfully",
  },
  async ({ session, req }) => {
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
        statusCode: 201,
        data: result.customerAddressCreate?.customerAddress,
      };
    }

    return {
      success: false,
      error: {
        type: "internal-server-error",
        message: "Internal server error occurred!",
        data: result.customerAddressCreate?.customerUserErrors,
      },
      statusCode: 400,
    };
  }
);

// update address
export const PATCH = apiHandler(
  {
    validateSession: true,
    errorMsg: "Failed to update address",
    successMsg: "Address updated successfully",
  },
  async ({ session, req }) => {
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
        statusCode: 200,
        data: result.customerAddressUpdate?.customerAddress,
      };
    }

    return {
      success: false,
      error: {
        type: "bad-request",
        message: "Bad request!",
        data: result.customerAddressUpdate?.customerUserErrors,
      },
      statusCode: 400,
    };
  }
);

// delete address
export const DELETE = apiHandler(
  {
    validateSession: true,
    errorMsg: "Failed to delete address",
    successMsg: "Address deleted successfully",
  },
  async ({ session, req }) => {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return {
        success: false,
        error: {
          type: "bad-request",
          message: "id is required in query params",
          data: null,
        },
        statusCode: 400,
      };
    }

    if (!session) {
      return {
        success: false,
        error: {
          type: "authentication",
          message: "Unauthorized",
          data: null,
        },
        statusCode: 401,
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
        statusCode: 200,
        data: result.customerAddressDelete?.deletedCustomerAddressId,
      };
    }

    return {
      success: false,
      error: {
        type: "bad-request",
        message: "Bad request!",
        data: result.customerAddressDelete?.customerUserErrors,
      },
      statusCode: 400,
    };
  }
);

// update default address
export const POST = apiHandler(
  {
    validateSession: true,
    errorMsg: "Failed to update default address",
    successMsg: "Default address updated successfully",
  },
  async ({ session, req }) => {
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
        statusCode: 200,
        data: result.customerDefaultAddressUpdate?.customer,
      };
    }

    return {
      success: false,
      error: {
        type: "bad-request",
        message: "Bad request!",
        data: result.customerDefaultAddressUpdate?.customerUserErrors,
      },
      statusCode: 400,
    };
  }
);
