import {
  getCollections,
  getSingleCollection,
} from "@/services/shopify/shopify-product.service";
import FeaturedCategorySection from "./_components/featured-category-section";
import FeaturedProductsSection from "./_components/featured-products-section";
import HomePageHeroSection from "./_components/hero-section";
import KeyHighlightSection from "./_components/key-highlight-section";
import NewsletterSection from "./_components/newsletter-section";
import TopProductsSection from "./_components/top-products-section";

export default async function Home() {
  const collectionsRes = await getCollections();

  const featuredCollectionId = collectionsRes.collections.nodes.find(
    (node) => node.handle === "featured-products"
  )?.id;

  const topProductsCollectionId = collectionsRes.collections.nodes.find(
    (node) => node.handle === "our-top-products"
  )?.id;

  const featured = featuredCollectionId
    ? await getSingleCollection(featuredCollectionId)
    : null;

  const topProducts = topProductsCollectionId
    ? await getSingleCollection(topProductsCollectionId)
    : null;

  return (
    <main>
      <HomePageHeroSection />
      <KeyHighlightSection />
      <TopProductsSection data={topProducts} />
      <FeaturedCategorySection data={collectionsRes} />
      <FeaturedProductsSection data={featured} />
      <NewsletterSection />
    </main>
  );
}
