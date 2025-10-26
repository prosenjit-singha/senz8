import { shopifyAPI } from "@/helpers/api.helpers";
import { createStore } from "@/lib/zustand";
import { ShopifyCartCreateInput } from "@/zod-schemas/shopify/cart.z";

type InitialState = {
  isOpen: boolean;
  data: null | (ShopifyCartCreateInput & { id: string });
};

const state: InitialState = {
  isOpen: false,
  data: {
    id: "",
    attributes: [],
    lines: [],
    buyerIdentity: {},
    delivery: {
      addresses: [],
    },
  },
};

export const useCartStore = createStore({
  name: "cart",
  persist: true,
  storage: "local",
  state,
  actions: (set) => ({
    setOpenState: (isOpen: boolean) =>
      set((data) => {
        data.state.isOpen = isOpen;
      }),
    addProduct: (product: ShopifyCartCreateInput["lines"][number]) =>
      set((data) => {
        if (data.state.data) {
          const existIndex = data.state.data.lines.findIndex(
            (item) =>
              item.merchandiseId === product.merchandiseId &&
              item.sellingPlanId === product.sellingPlanId
          );
          if (existIndex > -1) {
            data.state.data.lines[existIndex].quantity += product.quantity;
          } else {
            data.state.data.lines.push(product);
          }
        } else {
          data.state.data = {
            id: "",
            lines: [product],
          };
          // create cart in shopify
          shopifyAPI
            .post("/carts", {
              lines: [product],
            })
            .catch((err) => {
              data.state.data = null;
              console.error("Failed to add product to cart!", err);
            });
        }
      }),
    removeProduct: (
      merchandiseId: string,
      sellingPlanId?: string,
      quantity: number | "all" = 1
    ) =>
      set((data) => {
        if (data.state.data) {
          const existIndex = data.state.data.lines.findIndex(
            (item) =>
              item.merchandiseId === merchandiseId &&
              item.sellingPlanId === sellingPlanId
          );
          if (existIndex > -1) {
            if (quantity === "all") {
              data.state.data.lines.splice(existIndex, 1);
            } else {
              const newQuantity =
                data.state.data.lines[existIndex].quantity - quantity;
              if (newQuantity >= 0)
                data.state.data.lines[existIndex].quantity = newQuantity;
              else data.state.data.lines.splice(existIndex, 1);
            }
          }
        }
      }),
  }),
  partialize(state) {
    return { data: state.data };
  },
});

/**
  Notes
  Debugging a Slices pattern based store
  addBear: () =>
    set(
      (state) => ({ bears: state.bears + 1 }),
      undefined,
      'jungle:bear/addBear',
    ),
 */
