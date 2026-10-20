import React from 'react';
import { Hero } from '../components/home/Hero';
import { CategorySection } from '../components/home/CategorySection';
import { PopularProductsSection } from '../components/home/PopularProductsSection';
import { PromotionSection } from '../components/home/PromotionSection';
import { BestSellerSection } from '../components/home/BestSellerSection';
import { NewArrivalSection } from '../components/home/NewArrivalSection';
import { AboutSection } from '../components/home/AboutSection';
import { TrustSection } from '../components/home/TrustSection';
import { ReviewSection } from '../components/home/ReviewSection';
import { Newsletter } from '../components/home/Newsletter';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* 3. Hero */}
      <Hero />

      {/* 4. Categories */}
      <CategorySection />

      {/* 5. Nos produits populaires */}
      <PopularProductsSection />

      {/* 6. Les offres du moment */}
      <PromotionSection />

      {/* 7. Les plus populaires (Carousel horizontal) */}
      <BestSellerSection />

      {/* 8. Nouveautés */}
      <NewArrivalSection />

      {/* 9. Bien plus qu'une boutique */}
      <AboutSection />

      {/* 10. Trust section (5 piliers, icônes minimalistes, zéro fausse stat) */}
      <TrustSection />

      {/* 11. Avis clients */}
      <ReviewSection />

      {/* 12. Newsletter */}
      <Newsletter />
    </div>
  );
};
