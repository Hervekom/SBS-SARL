import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Star, CheckCircle, Camera, MessageSquarePlus } from 'lucide-react';

export const ReviewSection: React.FC = () => {
  const { reviews, setReviewModalOpen } = useShop();

  // Sort newest first
  const sortedReviews = [...reviews].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <section className="py-16 sm:py-24 bg-[#FFFFFF] border-t border-[#EAEAEA] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ======================================================== */}
        {/* EN-TÊTE : "Ce que nos clients pensent de nous"           */}
        {/* ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-5">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C2410C] block">
              Avis clients
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111111]">
              Ce que nos clients pensent de nous
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-light">
              Exemples d’avis pour la démonstration : ils seront remplacés par les vrais retours des clients SBS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {/* Note globale */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#EAEAEA] shadow-xs">
              <div className="flex text-[#D4A017]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#D4A017]" />
                ))}
              </div>
              <span className="text-xs font-bold font-mono text-[#111111]">4.9 / 5</span>
              <span className="text-[11px] text-neutral-400">({reviews.length} avis)</span>
            </div>

            {/* Bouton pour laisser un avis avec photo */}
            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-4 py-2 bg-[#111111] hover:bg-[#222222] text-[#F26B1D] font-bold text-xs rounded-2xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Laisser un avis avec photo</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* HAUTEUR VISUELLE CONTRÔLÉE AVEC SCROLL INTERNE          */}
        {/* Si beaucoup d'avis existent : scroll interne fluide      */}
        {/* ======================================================== */}
        <div className="max-h-[560px] overflow-y-auto pr-2 scrollbar-thin space-y-4 rounded-3xl border border-[#EAEAEA] p-4 sm:p-6 bg-white/70 shadow-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sortedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-5 rounded-2xl border border-[#EAEAEA] hover:border-[#F26B1D]/60 flex flex-col justify-between shadow-xs transition-all duration-200"
              >
                <div className="space-y-3">
                  
                  {/* Note et badge achat vérifié */}
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#D4A017]">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#D4A017]" />
                      ))}
                    </div>

                    {review.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Achat vérifié
                      </span>
                    )}
                  </div>

                  {/* Produit acheté */}
                  {review.productName && (
                    <div className="text-[11px] font-semibold text-[#C2410C] uppercase tracking-wide">
                      Produit : {review.productName}
                    </div>
                  )}

                  {/* Titre du commentaire */}
                  <h3 className="text-xs sm:text-sm font-bold text-[#111111] leading-snug">
                    "{review.title}"
                  </h3>

                  {/* Commentaire */}
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    {review.content}
                  </p>

                  {/* Photo facultative */}
                  {review.photo_url && (
                    <div className="pt-2">
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#F6F6F6] border border-[#EAEAEA] group">
                        <img
                          src={review.photo_url}
                          alt={`Photo partagée par ${review.author}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <span className="absolute bottom-2 left-2 bg-[#111111]/80 backdrop-blur-xs text-[#FFFFFF] text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                          <Camera className="w-3 h-3 text-[#F26B1D]" />
                          Photo client
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pied de carte : Auteur, Ville, Date */}
                <div className="pt-3.5 mt-3.5 border-t border-[#F0F0F0] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#111111]">{review.author}</p>
                    <p className="text-[11px] text-neutral-400 font-light">{review.location}</p>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">{review.date}</span>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
