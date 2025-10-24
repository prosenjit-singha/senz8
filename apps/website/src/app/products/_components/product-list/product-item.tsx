import { ComponentProps } from "react";
import { GetShopifyProductsRes } from "@/interfaces/shopify/shopify-products.interface";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import ProductItemActions from "./product-item-actions";

type ProductItemProps = Omit<ComponentProps<"li">, "children"> & {
  product: GetShopifyProductsRes["products"][number];
};

function ProductItem({ product, className, ...props }: ProductItemProps) {
  return (
    <li
      key={product.id}
      className={cn("product-container relative group border", className)}
      {...props}
    >
      {/* <div className="absolute rounded-lg w-full h-full group-hover:h-[60%] bg-transparent group-hover:bg-black/50 bottom-0 left-0 z-[-1] transition-all" /> */}
      <div className="w-full h-auto max-h-[250px] overflow-hidden">
        <Image
          src={
            product.images?.[0]?.url ||
            "https://media.istockphoto.com/id/2173059563/vector/coming-soon-image-on-white-background-no-photo-available.jpg?s=612x612&w=0&k=20&c=v0a_B58wPFNDPULSiw_BmPyhSNCyrP_d17i2BPPyDTk="
          }
          alt={product.images?.[0]?.altText || product.title}
          width={250}
          height={250}
          className="w-full h-full object-cover group-hover:scale-125 group-hover:-translate-y-10 transition-transform"
        />
      </div>
      <span className="golden-x-line block mb-4" />
      <div>
        <p className="font-bold text-lg text-center">{product.title}</p>
        <p className="text-center">{product.productType}</p>
        <div className="flex gap-4 items-center justify-between px-4 mt-4">
          {/* <Rating defaultValue={3} readOnly>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RatingButton
                     
                      // className="text-yellow-500"
                      key={index}
                      size={16}
                    />
                  ))}
                </Rating> */}

          <span className="text-primary font-black">₹ 4000</span>
        </div>
      </div>
      <ProductItemActions />
    </li>
  );
}

export default ProductItem;
