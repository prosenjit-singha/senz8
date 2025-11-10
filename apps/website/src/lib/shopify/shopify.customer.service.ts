// /lib/shopify.ts
import { CustomerSignUpBody } from "@/zod-schemas/shopify/customer.z";
import { ClientResponse } from "@shopify/storefront-api-client";
import { storefrontGraphQlApi } from "./shopify.client";
import { storefrontGraphQlRequest } from "@/graphql/shopify";
import {
  RenewCustomerAccessTokenDocument,
  RenewCustomerAccessTokenMutation,
  RenewCustomerAccessTokenMutationVariables,
} from "@/graphql";

const fetcher = storefrontGraphQlApi;

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  acceptsMarketing: boolean;
};

/** Login customer and get token + customer info */
export async function createToken(email: string, password: string) {
  const query = `mutation customerAccessTokenCreate {
    customerAccessTokenCreate(input: {email: "${email}", password: "${password}"}) {
      customerAccessToken {
        accessToken
      }
      customerUserErrors {
        message
        field
        code
      }
    }
  }`;

  const createTokenResult = await fetcher.post<
    ClientResponse<{
      customerAccessTokenCreate: {
        customerAccessToken: {
          accessToken: string;
          expiresAt: string;
        } | null;
        customerUserErrors: {
          message: string;
          field: string[];
          code: string;
        }[];
      };
    }>
  >("/", {
    query,
  });

  const { data, errors } = createTokenResult;

  if (errors) {
    return {
      data: null,
      errors,
      customer: null,
    };
  }

  // Fetch customer info using token
  if (data?.customerAccessTokenCreate.customerAccessToken?.accessToken) {
    const result = await getCustomer(
      data?.customerAccessTokenCreate.customerAccessToken.accessToken
    );
    return {
      data: data?.customerAccessTokenCreate.customerAccessToken,
      customer: result.data,
    };
  }

  return {
    data: null,
    customer: null,
    errors: [{ message: "Invalid email or password" }],
  };
}

export async function createCustomer(
  input: Omit<CustomerSignUpBody, "confirmPassword">
) {
  const query = `mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
          phone
          acceptsMarketing
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }`;

  const result = await fetcher.post<
    ClientResponse<{
      customerCreate: {
        customer: Customer;
        customerUserErrors: {
          message: string;
          field: string[];
          code: string;
        }[];
      };
    }>
  >("/", {
    query,
    variables: { input },
  });

  console.log("Create Customer Response", result);

  return result?.data?.customerCreate;
}

/** Renew Shopify token */
export async function renewToken(token: string) {
  const result = await storefrontGraphQlRequest<
    RenewCustomerAccessTokenMutation,
    RenewCustomerAccessTokenMutationVariables
  >(RenewCustomerAccessTokenDocument, {
    customerAccessToken: token,
  });
  return result;
}

export async function getCustomer(token: string) {
  const query = `query {
    customer(customerAccessToken: "${token}") {
      id
      displayName
      firstName
      lastName
      acceptsMarketing
      email
      phone
      createdAt
      updatedAt
      addresses(first: 10) {
        nodes {
          id
          address1
          address2
          city
          company
          formatted
          lastName
          name
          phone
          country
          countryCode
          formatted
          latitude
          longitude
          phone
          province
          provinceCode
          zip
        }
      }
    }
  }`;

  const result = await fetcher.post<
    ClientResponse<{
      customer: {
        id: string;
        displayName: string;
        firstName: string;
        lastName: string;
        acceptsMarketing: boolean;
        email: string;
        phone: string;
      };
    }>
  >("/", {
    query,
    variables: {
      customerAccessToken: token,
    },
  });

  return { data: result.data?.customer ?? null, errors: result.errors };
}

/** Revoke Shopify token */
export async function revokeToken(token: string) {
  const query = `
    mutation customerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        deletedCustomerAccessTokenId
      }
    }
  `;
  return storefrontGraphQlApi.post("/", {
    query,
    variables: { customerAccessToken: token },
  });
}
