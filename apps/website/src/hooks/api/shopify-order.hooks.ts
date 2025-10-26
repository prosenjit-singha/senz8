import { GetCustomerOrdersQuery } from "@/graphql";
import { shopifyAPI } from "@/helpers/api.helpers";
import { IApiSuccessResponse } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";

const customerOrdersQueryKeys = {
  getOrders: ["customer-orders"],
};

type CustomerOrders = NonNullable<GetCustomerOrdersQuery["customer"]>;

export const useCustomerOrdersQuery = () => {
  return useQuery<CustomerOrders>({
    queryKey: customerOrdersQueryKeys.getOrders,
    queryFn: async () =>
      shopifyAPI
        .get<IApiSuccessResponse<CustomerOrders>>("/orders")
        .then((res) => res.data),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 10,
  });
};
