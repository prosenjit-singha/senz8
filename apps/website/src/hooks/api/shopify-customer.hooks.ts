import {
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
