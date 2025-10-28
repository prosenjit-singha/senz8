import { ComponentProps } from "react";
import { GetShopifyProductsRes } from "@/interfaces/shopify/shopify-products.interface";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import ProductItemActions from "./product-item-actions";
import { Separator } from "@workspace/ui/components/separator";
import Link from "next/link";
import { GetProductsQuery } from "@/graphql";
type ProductItemProps = Omit<ComponentProps<"li">, "children"> & {
  product: GetProductsQuery["products"]["nodes"][number];
};

function ProductItem({ product, className, ...props }: ProductItemProps) {
  return (
    <li
      key={product.id}
      className={cn(
        "product-container relative group border flex flex-col hover:border-primary",
        className
      )}
      {...props}
    >
      <p className="absolute text-center left-4 top-4 bg-background border px-2  z-10">
        {product.productType}
      </p>
      {/* <div className="absolute rounded-lg w-full h-full group-hover:h-[60%] bg-transparent group-hover:bg-black/50 bottom-0 left-0 z-[-1] transition-all" /> */}
      <figure className="w-full bg-blue-200 h-[300px] overflow-hidden">
        <Image
          src={
            product.images?.nodes?.[0]?.url ||
            "https://media.istockphoto.com/id/2173059563/vector/coming-soon-image-on-white-background-no-photo-available.jpg?s=612x612&w=0&k=20&c=v0a_B58wPFNDPULSiw_BmPyhSNCyrP_d17i2BPPyDTk="
          }
          alt={product.images?.nodes?.[0]?.altText || product.title}
          width={600}
          height={300}
          className="w-full h-full object-cover group-hover:scale-110 duration-500 transition-transform"
        />
      </figure>
      {/* <span className="golden-x-line block mb-4" /> */}
      <Separator />
      <div className="p-4">
        <Link
          href={`/products/${product.handle}`}
          className="block font-medium text-lg text-center hover:text-primary hover:underline transition-colors duration-300"
        >
          {product.title}
        </Link>
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
        </div>
      </div>
      <ProductItemActions product={product} />
    </li>
  );
}

export default ProductItem;
