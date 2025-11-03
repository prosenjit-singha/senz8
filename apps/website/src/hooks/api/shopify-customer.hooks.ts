import {
  CustomerAddressCreateMutation,
  CustomerAddressCreateMutationVariables,
  CustomerAddressDeleteMutation,
  CustomerAddressUpdateMutation,
  CustomerAddressUpdateMutationVariables,
  CustomerDefaultAddressUpdateMutation,
  CustomerRecoverMutation,
  CustomerResetByUrlMutation,
  CustomerResetByUrlMutationVariables,
  CustomerResetMutation,
  CustomerResetMutationVariables,
  GetCustomerQuery,
  UpdateCustomerMutation,
  UpdateCustomerMutationVariables,
} from "@/graphql";
import { useMutation, useQuery } from "@tanstack/react-query";
import { shopifyAPI } from "@/helpers/api.helpers";
import { IApiFailedResponse, IApiSuccessResponse } from "@/interfaces";

export const myAccountQueryKey = {
  details: ["my-account-details"],
  updateDetails: ["my-account-details-update"],
  addAddress: ["my-account-details-add-address"],
  recoverAccount: ["customer-recover"],
  resetPassword: ["customer-reset-password"],
  resetPasswordByUrl: ["customer-reset-password-by-url"],
};

export const useGetMyAccountDetailsQuery = () => {
  return useQuery<GetCustomerQuery["customer"], IApiFailedResponse>({
    queryKey: myAccountQueryKey.details,
    queryFn: async () =>
      shopifyAPI
        .get<IApiSuccessResponse<GetCustomerQuery["customer"]>>("/customers/me")
        .then((res) => res.data),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
};

export const useUpdateMyAccountDetailsMutation = () => {
  return useMutation<
    NonNullable<UpdateCustomerMutation["customerUpdate"]>["customer"],
    IApiFailedResponse,
    UpdateCustomerMutationVariables["customer"]
  >({
    mutationFn: async (body) =>
      shopifyAPI
        .post<
          IApiSuccessResponse<GetCustomerQuery["customer"]>
        >("/customers/me", body)
        .then((res) => res.data),
    mutationKey: myAccountQueryKey.updateDetails,
    meta: {
      invalidateQueries: myAccountQueryKey.details,
    },
  });
};

export const useAddDeliveryAddress = () => {
  return useMutation<
    NonNullable<
      CustomerAddressCreateMutation["customerAddressCreate"]
    >["customerAddress"],
    IApiFailedResponse,
    CustomerAddressCreateMutationVariables["address"]
  >({
    mutationFn: async (body) =>
      shopifyAPI
        .put<
          IApiSuccessResponse<
            NonNullable<
              CustomerAddressCreateMutation["customerAddressCreate"]
            >["customerAddress"]
          >
        >("/customers/me/address", body)
        .then((res) => res.data),
    mutationKey: myAccountQueryKey.addAddress,
    meta: {
      invalidateQueries: myAccountQueryKey.details,
    },
  });
};

export const useUpdateDeliveryAddress = () => {
  return useMutation<
    NonNullable<
      CustomerAddressUpdateMutation["customerAddressUpdate"]
    >["customerAddress"],
    IApiFailedResponse,
    CustomerAddressUpdateMutationVariables["address"] & { id: string }
  >({
    mutationFn: async (body) =>
      shopifyAPI
        .patch<
          IApiSuccessResponse<
            NonNullable<
              CustomerAddressUpdateMutation["customerAddressUpdate"]
            >["customerAddress"]
          >
        >("/customers/me/address", body)
        .then((res) => res.data),
    mutationKey: myAccountQueryKey.addAddress,
    meta: {
      invalidateQueries: myAccountQueryKey.details,
    },
  });
};

export const useDeleteDeliveryAddress = () => {
  return useMutation<
    NonNullable<
      CustomerAddressDeleteMutation["customerAddressDelete"]
    >["deletedCustomerAddressId"],
    IApiFailedResponse,
    string
  >({
    mutationFn: async (id) =>
      shopifyAPI
        .delete<
          IApiSuccessResponse<
            NonNullable<
              CustomerAddressDeleteMutation["customerAddressDelete"]
            >["deletedCustomerAddressId"]
          >
        >("/customers/me/address?id=" + id)
        .then((res) => res.data),
    mutationKey: myAccountQueryKey.addAddress,
    meta: {
      invalidateQueries: myAccountQueryKey.details,
    },
  });
};

export const useUpdateDeliveryDefaultAddress = () => {
  return useMutation<
    NonNullable<
      CustomerDefaultAddressUpdateMutation["customerDefaultAddressUpdate"]
    >["customer"],
    IApiFailedResponse,
    string
  >({
    mutationFn: async (addressId) =>
      shopifyAPI
        .post<
          IApiSuccessResponse<
            NonNullable<
              CustomerDefaultAddressUpdateMutation["customerDefaultAddressUpdate"]
            >["customer"]
          >
        >("/customers/me/address", { addressId })
        .then((res) => res.data),
    mutationKey: myAccountQueryKey.addAddress,
    meta: {
      invalidateQueries: myAccountQueryKey.details,
    },
  });
};

/** RESET PASSWORD */
export const useSendRecoveryEmail = () => {
  return useMutation<
    NonNullable<CustomerRecoverMutation["customerRecover"]>,
    IApiFailedResponse,
    string
  >({
    mutationFn: async (email) =>
      shopifyAPI
        .post<
          IApiSuccessResponse<
            NonNullable<CustomerRecoverMutation["customerRecover"]>
          >
        >("/customers/recover", { email })
        .then((res) => res.data),
    mutationKey: myAccountQueryKey.recoverAccount,
  });
};

export const useResetPassword = () => {
  return useMutation<
    NonNullable<CustomerResetMutation["customerReset"]>,
    IApiFailedResponse,
    CustomerResetMutationVariables
  >({
    mutationFn: async (body) =>
      shopifyAPI
        .post<
          IApiSuccessResponse<
            NonNullable<CustomerResetMutation["customerReset"]>
          >
        >("/customers/reset-password", body)
        .then((res) => res.data),
    mutationKey: myAccountQueryKey.resetPassword,
  });
};

export const useResetPasswordByUrl = () => {
  return useMutation<
    NonNullable<CustomerResetByUrlMutation["customerResetByUrl"]>,
    IApiFailedResponse,
    CustomerResetByUrlMutationVariables
  >({
    mutationFn: async (body) =>
      shopifyAPI
        .post<
          IApiSuccessResponse<
            NonNullable<CustomerResetByUrlMutation["customerResetByUrl"]>
          >
        >("/customers/reset-password-by-url", body)
        .then((res) => res.data),
    mutationKey: myAccountQueryKey.resetPasswordByUrl,
  });
};
