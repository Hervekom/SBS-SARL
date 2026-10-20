import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Star, Camera, X, CheckCircle2, Upload } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const { reviewModalOpen, setReviewModalOpen, reviewTargetOrder, addReview } = useShop();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState(reviewTargetOrder?.customerName || 'Amina Traoré');
  const [location, setLocation] = useState(reviewTargetOrder?.city ? `${reviewTargetOrder.city}, ${reviewTargetOrder.country}` : 'Douala, Cameroun');
  const [productName, setProductName] = useState(
    reviewTargetOrder?.items?.[0]?.product?.name || 'Samsung Galaxy A55 5G 128 Go'
  );
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  if (!reviewModalOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !title.trim()) return;

    addReview({
      author,
      location,
      rating,
      title,
      content,
      productName,
      photo_url: photoUrl || undefined,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReviewModalOpen(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn text-left">
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#EAEAEA] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#EAEAEA] flex items-center justify-between bg-white">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C2410C]">
              Avis Client Certifié
            </span>
            <h3 className="text-base font-bold text-[#111111]">
              Votre expérience chez SBS SARL
            </h3>
          </div>
          <button
            onClick={() => setReviewModalOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-[#111111] hover:bg-[#F6F6F6] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#111111]">Merci pour votre précieux avis !</h4>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              {isSupabaseConfigured ? 'Votre avis a bien été envoyé. Il sera publié après vérification par l’équipe SBS.' : 'Votre avis a été publié en tête de liste et aidera nos futurs clients.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
            {/* Note en étoiles */}
            <div>
              <label className="font-bold text-[#111111] block mb-1.5">Note globale *</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating || rating)
                          ? 'fill-[#F26B1D] text-[#F26B1D]'
                          : 'text-neutral-300 fill-none'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-mono font-bold text-sm text-[#111111]">
                  {rating} / 5
                </span>
              </div>
            </div>

            {/* Produit acheté */}
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">Produit acheté</label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex: iPhone 15 Pro Max, Power Bank 20 000 mAh..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEAEA] bg-white focus:outline-none focus:border-[#F26B1D]"
              />
            </div>

            {/* Titre du commentaire */}
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">
                Titre de votre avis *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Téléphone conforme, livraison rapide à Akwa"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEAEA] bg-white focus:outline-none focus:border-[#F26B1D]"
              />
            </div>

            {/* Commentaire détaillé */}
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">
                Votre commentaire détaillé *
              </label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Partagez votre expérience sur la qualité, la conformité et le service..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEAEA] bg-white focus:outline-none focus:border-[#F26B1D] resize-none"
              />
            </div>

            {/* Photo Facultative (Pas de vidéo) */}
            <div className="space-y-2">
              <label className="font-semibold text-neutral-700 block">
                Ajouter une photo de votre article reçu <span className="font-normal text-neutral-400">(Facultatif)</span>
              </label>

              {photoUrl ? (
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-[#EAEAEA] bg-white p-1">
                  <img src={photoUrl} alt="Photo avis" className="w-full h-full object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-black"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-[#DADADA] hover:border-[#F26B1D] bg-white cursor-pointer transition-colors">
                  <Camera className="w-5 h-5 text-[#F26B1D]" />
                  <span className="text-xs text-neutral-600 font-medium">
                    Sélectionner une photo depuis votre appareil
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Nom & Localisation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Votre Nom</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EAEAEA] bg-white focus:outline-none focus:border-[#F26B1D]"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Ville / Pays</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EAEAEA] bg-white focus:outline-none focus:border-[#F26B1D]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#111111] hover:bg-[#222222] text-[#FFFFFF] font-bold text-xs rounded-xl tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Publier mon avis certifié</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
