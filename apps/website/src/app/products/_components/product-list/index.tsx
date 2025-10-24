import { GetShopifyProductsRes } from "@/interfaces/shopify/shopify-products.interface";
import ProductItem from "./product-item";

type ProductListProps = {
  data: GetShopifyProductsRes;
};

function ProductList({ data }: ProductListProps) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-4 max-w-page mx-page-margin-auto py-page-margin">
      {data.products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </ul>
  );
}

export default ProductList;
