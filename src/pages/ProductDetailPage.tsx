import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useShop, useCatalog } from '../context/ShopContext';
import { CATEGORIES, heroBannerImg, SHOP, whatsappLink } from '../data/products';
import { ProductCard } from '../components/products/ProductCard';
import {
  ChevronRight,
  ChevronLeft,
  Star,
  ShoppingBag,
  Zap,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  CheckCircle2,
  Share2,
  MessageCircle,
  ZoomIn,
  Maximize2,
  X,
  ChevronDown,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigate,
    setIsCartDrawerOpen,
  } = useShop();
  const PRODUCTS = useCatalog();
  const { reviews: REVIEWS } = useShop();

  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
  const category = CATEGORIES.find((c) => c.id === (product.category_id || product.category));
  const relatedProducts = PRODUCTS.filter(
    (p) => (p.category_id || p.category) === (product.category_id || product.category) && p.id !== product.id
  ).slice(0, 4);

  // Gallery images collection
  const galleryImages = useMemo(() => {
    const list: string[] = [];
    if (product.image_url) list.push(product.image_url);
    else if (product.image) list.push(product.image);

    if (product.gallery && product.gallery.length > 0) {
      product.gallery.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    }

    // Add complementary luxury studio angles if only 1 image
    if (list.length < 3) {
      if (category?.image && !list.includes(category.image)) list.push(category.image);
      if (!list.includes(heroBannerImg)) list.push(heroBannerImg);
    }
    return list;
  }, [product]);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'returns' | 'reviews'>('desc');
  const [openMobileAccordions, setOpenMobileAccordions] = useState<Record<string, boolean>>({
    desc: true,
    specs: false,
    shipping: false,
    returns: false,
    reviews: false,
  });

  // Zoom state
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isFavorited = isInWishlist(product.id);

  // Handle keyboard arrow keys & escape for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'Escape') setIsFullscreen(false);
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, galleryImages.length]);

  const nextImage = () => {
    setActiveImgIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImgIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  // Add to cart
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsCartDrawerOpen(true);
  };

  // Buy Now (Immediate Checkout)
  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const toggleAccordion = (key: string) => {
    setOpenMobileAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="py-6 sm:py-10 bg-[#FFFFFF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* ======================================================== */}
        {/* FIL D'ARIANE (BREADCRUMB)                                */}
        {/* ======================================================== */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500">
          <button onClick={() => navigate('/')} className="hover:text-[#111111] transition-colors cursor-pointer">
            Accueil
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <button
            onClick={() => navigate(`/${product.category_id || product.category}`)}
            className="hover:text-[#111111] transition-colors cursor-pointer"
          >
            {category?.name || 'Rayon'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[#111111] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* ======================================================== */}
        {/* GRILLE PRODUIT : GAUCHE (Galerie) | DROITE (Module Achat) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ======================================================== */}
          {/* GAUCHE : GALERIE IMAGES HAUTE DÉFINITION                  */}
          {/* Support : multi-images, thumbnails, zoom, fullscreen, nav */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Conteneur Image Principale */}
            <div
              className="relative aspect-4/3 sm:aspect-[4/3] w-full rounded-3xl overflow-hidden bg-[#F6F6F6] border border-[#EAEAEA] flex items-center justify-center p-4 group select-none shadow-xs"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              {/* Image avec support du Zoom survol sans déformation */}
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <img
                  src={galleryImages[activeImgIndex]}
                  alt={`${product.name} - Vue ${activeImgIndex + 1}`}
                  className="max-h-[460px] sm:max-h-[500px] w-auto max-w-full object-contain transition-transform duration-200"
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isZooming ? 'scale(1.85)' : 'scale(1)',
                    cursor: isZooming ? 'zoom-in' : 'default',
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Badge d'état si présent */}
              {product.badge && (
                <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-[#111111] text-[#F26B1D] rounded-xl shadow-xs z-10">
                  {product.badge}
                </span>
              )}

              {/* Actions Flottantes Haut Droite : Wishlist + Fullscreen */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="p-2.5 rounded-full bg-white/90 hover:bg-[#111111] hover:text-white text-neutral-700 shadow-xs transition-colors cursor-pointer"
                  title="Afficher en plein écran"
                  aria-label="Plein écran"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-full transition-all cursor-pointer ${
                    isFavorited
                      ? 'bg-[#111111] text-[#F26B1D] shadow-md scale-105'
                      : 'bg-white/90 hover:bg-white text-neutral-700 hover:text-[#111111] shadow-xs'
                  }`}
                  title={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  aria-label="Favori"
                >
                  <Heart className={`w-4 h-4 transition-transform active:scale-90 ${isFavorited ? 'fill-[#F26B1D] text-[#F26B1D]' : 'text-neutral-600 fill-none'}`} />
                </button>
              </div>

              {/* Navigation Précédent / Suivant sur l'image */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-[#111111] hover:text-white text-[#111111] flex items-center justify-center shadow-md transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-[#111111] hover:text-white text-[#111111] flex items-center justify-center shadow-md transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Indicateur de zoom au survol */}
              <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-xs text-[11px] text-neutral-600 px-2.5 py-1 rounded-lg border border-[#EAEAEA] pointer-events-none flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3.5 h-3.5 text-[#F26B1D]" />
                <span className="hidden sm:inline">Survoler pour zoomer</span>
              </div>
            </div>

            {/* Thumbnails (Vignettes) */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-[#F6F6F6] p-1.5 border-2 transition-all cursor-pointer shrink-0 ${
                      activeImgIndex === idx
                        ? 'border-[#F26B1D] shadow-md scale-102 bg-white'
                        : 'border-[#EAEAEA] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Miniature ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* DROITE : INFORMATIONS COMMERCIALES & MODULE D'ACHAT      */}
          {/* Catégorie | Nom | Évaluation | Prix | Ancien prix |       */}
          {/* Disponibilité | Description | Quantité | Ajouter panier  */}
          {/* | Acheter maintenant                                    */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#EAEAEA] space-y-6 shadow-xs text-left">
            
            <div className="space-y-2">
              {/* 1. Catégorie & Badge officiel */}
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase font-bold tracking-widest text-[#C2410C]">
                  {product.sub_category || product.subCategory}
                </span>
                
                {/* Disponibilité */}
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {product.in_stock || product.inStock ? 'En stock' : 'Sur commande'}
                </span>
              </div>

              {/* 2. Nom du Produit */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] leading-tight">
                {product.name}
              </h1>

              {/* 3. Évaluation */}
              <div className="flex items-center gap-2 pt-0.5">
                <div className="flex text-[#D4A017]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 5) ? 'fill-[#F26B1D]' : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono font-bold text-neutral-800">
                  {(product.rating || 5).toFixed(1)} / 5
                </span>
                <span className="text-xs text-neutral-400">
                  ({product.review_count || product.reviewCount || 42} avis)
                </span>
              </div>
            </div>

            {/* 4. Prix & ancien prix en FCFA */}
            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EEEEEE] flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-neutral-500 uppercase font-semibold block">
                  Prix SBS
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-mono tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>

              {(product.original_price || product.originalPrice) && (
                <div className="text-right">
                  <span className="text-xs text-neutral-400 line-through font-mono tabular-nums block">
                    {formatPrice(product.original_price || product.originalPrice!)}
                  </span>
                  <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 mt-0.5 inline-block">
                    Économisez {formatPrice((product.original_price || product.originalPrice!) - product.price)}
                  </span>
                </div>
              )}
            </div>

            {/* 5. Description */}
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              {product.description}
            </p>

            {/* 6. Quantité + Boutons d'Action */}
            <div className="space-y-3 pt-2">
              
              {/* Sélecteur de Quantité */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#EAEAEA] rounded-xl bg-[#F6F6F6] px-3 py-2 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-[#F26B1D] font-bold cursor-pointer text-xs"
                    aria-label="Diminuer la quantité"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs sm:text-sm font-mono font-bold text-[#111111]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:text-[#F26B1D] font-bold cursor-pointer text-xs"
                    aria-label="Augmenter la quantité"
                  >
                    +
                  </button>
                </div>

                {/* 7. Bouton : Ajouter au panier */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-white hover:bg-[#F6F6F6] text-[#111111] border-2 border-[#111111] font-bold text-xs sm:text-sm rounded-xl tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <ShoppingBag className="w-4 h-4 text-[#F26B1D] group-hover:scale-110 transition-transform" />
                  <span>Ajouter au panier</span>
                </button>
              </div>

              {/* 8. Bouton : Acheter maintenant (Direct Checkout) */}
              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-[#111111] hover:bg-[#222222] text-[#FFFFFF] font-bold text-sm rounded-xl tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Zap className="w-4 h-4 text-[#F26B1D] fill-[#F26B1D]" />
                <span>Acheter maintenant</span>
              </button>

              {/* Commande directe par WhatsApp */}
              <a
                href={whatsappLink(
                  `Bonjour SBS SARL, je souhaite commander : ${product.name} (Qté : ${quantity}, Prix : ${formatPrice(
                    product.price * quantity
                  )}).`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl tracking-wide transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Commander sur WhatsApp</span>
              </a>

              {/* Partage & Référence */}
              <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-[#111111] transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Lien copié !' : 'Partager'}</span>
                </button>
                <span className="font-mono text-[11px] text-neutral-400">Réf : {product.id}</span>
              </div>
            </div>

            {/* Garanties Officielles */}
            <div className="pt-4 border-t border-[#F0F0F0] grid grid-cols-3 gap-2 text-center text-[11px] text-neutral-600">
              <div className="space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#F26B1D] mx-auto" />
                <p className="font-semibold text-[#111111]">Neuf & garanti</p>
                <p className="text-[10px] text-neutral-400">Garantie vérifiée</p>
              </div>
              <div className="space-y-1">
                <Truck className="w-4 h-4 text-[#F26B1D] mx-auto" />
                <p className="font-semibold text-[#111111]">Livraison 24h Douala</p>
                <p className="text-[10px] text-neutral-400">En 24h / 48h</p>
              </div>
              <div className="space-y-1">
                <RotateCcw className="w-4 h-4 text-[#F26B1D] mx-auto" />
                <p className="font-semibold text-[#111111]">Retour 7 Jours</p>
                <p className="text-[10px] text-neutral-400">Échange simple</p>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* INFORMATIONS SOUS LE PRODUIT                             */}
        {/* Description | Caractéristiques | Livraison | Retours |   */}
        {/* Avis clients. Accordéons sur Mobile, Onglets sur Desktop */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 sm:p-10 shadow-xs space-y-6 text-left">
          
          {/* Onglets Desktop (Cachés sur mobile) */}
          <div className="hidden md:flex items-center gap-2 border-b border-[#EAEAEA] pb-3 overflow-x-auto scrollbar-none">
            {[
              { id: 'desc', label: 'Description Complète' },
              { id: 'specs', label: 'Caractéristiques Techniques' },
              { id: 'shipping', label: 'Livraison' },
              { id: 'returns', label: 'Politique de Retours' },
              { id: 'reviews', label: `Avis Clients (${product.review_count || product.reviewCount || 42})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#111111] text-[#F26B1D] shadow-xs'
                    : 'text-neutral-600 hover:text-[#111111] hover:bg-[#F6F6F6]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ======================================================== */}
          {/* ACCORDÉONS MOBILE OU CONTENU ONGLETS DESKTOP            */}
          {/* ======================================================== */}
          <div className="space-y-4">
            
            {/* 1. DESCRIPTION */}
            <div className="md:border-none border border-[#EAEAEA] rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('desc')}
                className="md:hidden w-full p-4 bg-[#FAFAFA] flex items-center justify-between text-xs font-bold text-[#111111]"
              >
                <span>Description Complète</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openMobileAccordions.desc ? 'rotate-180 text-[#F26B1D]' : ''}`} />
              </button>
              {(activeTab === 'desc' || openMobileAccordions.desc) && (
                <div className="p-4 md:p-0 space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                  <p>{product.description}</p>
                  <p>
                    Chez SBS SARL, chaque téléphone est contrôlé devant vous (scellés, IMEI, fonctionnement) et chaque accessoire est testé avant la livraison.
                  </p>
                </div>
              )}
            </div>

            {/* 2. CARACTÉRISTIQUES */}
            <div className="md:border-none border border-[#EAEAEA] rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('specs')}
                className="md:hidden w-full p-4 bg-[#FAFAFA] flex items-center justify-between text-xs font-bold text-[#111111]"
              >
                <span>Caractéristiques</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openMobileAccordions.specs ? 'rotate-180 text-[#F26B1D]' : ''}`} />
              </button>
              {(activeTab === 'specs' || openMobileAccordions.specs) && (
                <div className="p-4 md:p-0 space-y-6">
                  {/* Points Clés */}
                  {product.features && product.features.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                        Points Forts
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {product.features.map((feat, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFFFFF] border border-[#F0F0F0]"
                          >
                            <Check className="w-4 h-4 text-[#F26B1D] shrink-0 mt-0.5" />
                            <span className="text-xs text-neutral-700">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fiche Détaillée */}
                  {product.specs && Object.keys(product.specs).length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                        Fiche Technique Officielle
                      </h4>
                      <div className="border border-[#EAEAEA] rounded-2xl overflow-hidden divide-y divide-[#EAEAEA]">
                        {Object.entries(product.specs).map(([key, val], idx) => (
                          <div
                            key={idx}
                            className={`grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs ${
                              idx % 2 === 0 ? 'bg-white' : 'bg-[#FFFFFF]'
                            }`}
                          >
                            <span className="font-semibold text-[#111111]">{key}</span>
                            <span className="text-neutral-600 sm:col-span-2 font-mono">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. LIVRAISON */}
            <div className="md:border-none border border-[#EAEAEA] rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('shipping')}
                className="md:hidden w-full p-4 bg-[#FAFAFA] flex items-center justify-between text-xs font-bold text-[#111111]"
              >
                <span>Livraison</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openMobileAccordions.shipping ? 'rotate-180 text-[#F26B1D]' : ''}`} />
              </button>
              {(activeTab === 'shipping' || openMobileAccordions.shipping) && (
                <div className="p-4 md:p-0 space-y-3 text-xs text-neutral-600 leading-relaxed font-light">
                  <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#EAEAEA] space-y-2">
                    <h4 className="font-bold text-xs text-[#111111] flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#F26B1D]" />
                      Livraison au Cameroun
                    </h4>
                    <p>
                      - <strong>Douala</strong> : livraison le jour même ou sous 24h. Paiement en espèces à la livraison après vérification du colis.
                    </p>
                    <p>
                      - <strong>Yaoundé et autres villes</strong> : expédition par agence de voyage en 24h à 72h, paiement Mobile Money avant envoi.
                    </p>
                    <p>
                      - <strong>Retrait en boutique</strong> : gratuit, avec pose du verre trempé offerte.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 4. RETOURS */}
            <div className="md:border-none border border-[#EAEAEA] rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('returns')}
                className="md:hidden w-full p-4 bg-[#FAFAFA] flex items-center justify-between text-xs font-bold text-[#111111]"
              >
                <span>Retours</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openMobileAccordions.returns ? 'rotate-180 text-[#F26B1D]' : ''}`} />
              </button>
              {(activeTab === 'returns' || openMobileAccordions.returns) && (
                <div className="p-4 md:p-0 space-y-3 text-xs text-neutral-600 leading-relaxed font-light">
                  <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#EAEAEA] space-y-2">
                    <h4 className="font-bold text-xs text-[#111111] flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-[#F26B1D]" />
                      Échange sous 7 jours
                    </h4>
                    <p>
                      En cas de défaut constaté, vous disposez de 7 jours après réception pour demander un échange. L’article doit être rapporté complet dans son emballage d’origine (conditions à confirmer par SBS SARL).
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 5. AVIS CLIENTS */}
            <div className="md:border-none border border-[#EAEAEA] rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('reviews')}
                className="md:hidden w-full p-4 bg-[#FAFAFA] flex items-center justify-between text-xs font-bold text-[#111111]"
              >
                <span>Avis Clients ({product.review_count || product.reviewCount || 42})</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openMobileAccordions.reviews ? 'rotate-180 text-[#F26B1D]' : ''}`} />
              </button>
              {(activeTab === 'reviews' || openMobileAccordions.reviews) && (
                <div className="p-4 md:p-0 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAEAEA]">
                    <div>
                      <p className="text-2xl font-extrabold text-[#111111] font-mono">
                        {(product.rating || 5).toFixed(1)} / 5
                      </p>
                      <div className="flex text-[#D4A017] my-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#D4A017]" />
                        ))}
                      </div>
                      <p className="text-xs text-neutral-400">
                        Basé sur {product.review_count || product.reviewCount || 42} avis
                      </p>
                    </div>

                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#111111] text-[#F26B1D] text-xs font-bold rounded-xl hover:bg-[#222222] transition-colors"
                    >
                      Donner mon avis client
                    </a>
                  </div>

                  <div className="space-y-3">
                    {REVIEWS.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl border border-[#EAEAEA] bg-white space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#111111]">{rev.author}</span>
                            <span className="text-neutral-400">·</span>
                            <span className="text-neutral-500">{rev.location}</span>
                          </div>
                          <span className="text-neutral-400 font-mono text-[11px]">{rev.date}</span>
                        </div>
                        <div className="flex text-[#D4A017]">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#D4A017]" />
                          ))}
                        </div>
                        <p className="text-xs font-bold text-[#111111]">"{rev.title}"</p>
                        <p className="text-xs text-neutral-600 font-light leading-relaxed">
                          {rev.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* PRODUITS RECOMMANDÉS DANS LE MÊME RAYON                  */}
        {/* ======================================================== */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#C2410C]">
                  Dans le même univers
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#111111] mt-1">
                  Vous pourriez aussi aimer
                </h3>
              </div>
              <button
                onClick={() => navigate(`/${product.category_id || product.category}`)}
                className="text-xs font-bold text-[#111111] hover:text-[#C2410C] transition-colors cursor-pointer"
              >
                Explorer tout le rayon →
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL FULLSCREEN LIGHTBOX                                */}
      {/* ======================================================== */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-10">
            <span className="text-xs font-mono text-[#F26B1D] font-bold">
              {activeImgIndex + 1} / {galleryImages.length}
            </span>

            <span className="text-xs font-medium text-neutral-300 truncate max-w-sm hidden sm:inline">
              {product.name}
            </span>

            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white hover:text-[#111111] text-white transition-colors cursor-pointer"
              aria-label="Fermer le plein écran"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Central Image with Preserved Proportions */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-8 select-none">
            <img
              src={galleryImages[activeImgIndex]}
              alt=""
              className="max-h-[82vh] max-w-full w-auto object-contain transition-transform"
            />

            {/* Prev / Next buttons in Fullscreen */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white text-white hover:text-black transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white text-white hover:text-black transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2 z-10">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImgIndex(i)}
                  className={`w-14 h-14 rounded-xl overflow-hidden p-1 border-2 transition-all cursor-pointer ${
                    activeImgIndex === i ? 'border-[#F26B1D] scale-110 bg-white/10' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
