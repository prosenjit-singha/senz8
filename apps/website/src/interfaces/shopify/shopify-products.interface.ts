export interface GetShopifyProductsRes {
  products: Product[];
  pageInfo: PageInfo;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

interface Product {
  id: string;
  title: string;
  bodyHtml: null | string;
  vendor: string;
  productType: string;
  createdAt: Date;
  handle: string;
  updatedAt: Date;
  publishedAt: Date | null;
  templateSuffix: null;
  tags: Tag[];
  status: Status;
  publicationCount: number;
  images: Image[];
  options: Option[];
  variants: {
    id: string;
    title: string;
    price: string;
    availableForSale: boolean;
    quantityAvailable: number;
  }[];
}

interface Image {
  id: string;
  altText: string;
  width: number;
  height: number;
  url: string;
}

interface Option {
  id: string;
  name: Name;
  position: number;
  values: string[];
}

enum Name {
  Color = "Color",
  Denominations = "Denominations",
  Title = "Title",
}

enum Status {
  Active = "ACTIVE",
}

enum Tag {
  Accessory = "Accessory",
  Premium = "Premium",
  Snow = "Snow",
  Snowboard = "Snowboard",
  Sport = "Sport",
  Winter = "Winter",
}
