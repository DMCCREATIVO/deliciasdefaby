import { Layout } from "./Layout";
import { HeroSection } from "./about/HeroSection";
import { StorySection } from "./about/StorySection";
import { ProductsSection } from "./about/ProductsSection";
import { ValuesSection } from "./about/ValuesSection";

export const AboutUs = () => {
  return (
    <Layout>
      <div className="w-full">
        <HeroSection />
        <StorySection />
        <ProductsSection />
        <ValuesSection />
      </div>
    </Layout>
  );
};