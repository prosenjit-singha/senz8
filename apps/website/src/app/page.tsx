import FeaturedCategorySection from "./_components/featured-category-section";
import FeaturedProductsSection from "./_components/featured-products-section";
import HomePageHeroSection from "./_components/hero-section";
import KeyHighlightSection from "./_components/key-highlight-section";
import NewsletterSection from "./_components/newsletter-section";
import TopProductsSection from "./_components/top-products-section";

export default function Home() {
  return (
    <main>
      <HomePageHeroSection />
      <KeyHighlightSection />
      <TopProductsSection />
      <FeaturedCategorySection />
      <FeaturedProductsSection />
      <NewsletterSection />
    </main>
  );
}
