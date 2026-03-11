import React from "react";
import { Hero } from "@/components/Hero";
import { ProductCatalog } from "@/components/ProductCatalog";
import { Features } from "@/components/Features";
import { BlogPreview } from "@/components/BlogPreview";
import { Testimonials } from "@/components/Testimonials";

export default function Index() {
  return (
    <main className="bg-background min-h-screen w-full flex flex-col gap-0">
      <Hero />
      <ProductCatalog />
      <Features />
      <BlogPreview />
      <Testimonials />
    </main>
  );
}
