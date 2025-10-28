import { GetProductsQuery } from "@/graphql";
import ProductItem from "./product-item";

type ProductListProps = {
  data: NonNullable<GetProductsQuery["products"]>;
};

function ProductList({ data }: ProductListProps) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-4 max-w-page mx-page-margin-auto">
      {data.nodes.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </ul>
  );
}

export default ProductList;
