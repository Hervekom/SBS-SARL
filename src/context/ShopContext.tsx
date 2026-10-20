import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Currency, Product, Review, Order } from '../types';
import { PRODUCTS, REVIEWS, PROMO_CODES } from '../data/products';
import { HomepageConfig, defaultHomepageConfig, fetchProducts, fetchReviews, submitReview, isSupabaseConfigured } from '../lib/supabase';

interface ShopContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;

  homepageConfig: HomepageConfig;
  updateHomepageConfig: (config: Partial<HomepageConfig>) => void;

  cart: CartItem[];
  wishlist: string[];
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInXOF: number) => string;
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  currentPath: string;
  navigate: (path: string) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Orders & Tracking
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;

  // Reviews System (Sorted Newest First)
  reviews: Review[];
  addReview: (review: {
    author: string;
    location: string;
    rating: number;
    title: string;
    content: string;
    productName: string;
    photo_url?: string;
  }) => void;
  reviewModalOpen: boolean;
  setReviewModalOpen: (open: boolean) => void;
  reviewTargetOrder: Order | null;
  setReviewTargetOrder: (order: Order | null) => void;

  // Source des données
  isLiveData: boolean;

  // Code promo (partagé panier → paiement)
  promoCode: string;
  discountPercent: number;
  discountAmount: number;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);


// Normalizing default products to ensure all Supabase fields are fully satisfied
const INITIAL_STORE_PRODUCTS: Product[] = PRODUCTS.map((p) => ({
  ...p,
  stock: p.stock_count || p.stockCount || 10,
  old_price: p.original_price || p.originalPrice,
  images: p.gallery && p.gallery.length > 0 ? p.gallery : [p.image_url || p.image],
  is_featured: Boolean(p.is_popular || p.isBestSeller),
  is_new: Boolean(p.is_new || p.isNewArrival),
  is_best_seller: Boolean(p.isBestSeller || p.is_popular),
  is_active: true,
  created_at: p.created_at || new Date().toISOString(),
}));

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    orderId: 'SBS-782910',
    date: 'Il y a 2 jours',
    customerName: 'Client Démo',
    email: 'client.demo@example.com',
    phone: '+237 6XX XX XX XX',
    country: 'Cameroun',
    city: 'Douala',
    address: 'Akwa, Boulevard de la Liberté',
    postalCode: '',
    shippingMethod: 'Livraison Express Douala (24h)',
    paymentMethod: 'Paiement à la livraison (Espèces)',
    items: [],
    totalAmount: 237000,
    status: 'Livrée et reçue',
    deliveredAt: 'Hier à 14h30',
    hasReviewed: false,
  }
];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products Management
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('sbs_products_v1');
      if (saved && !isSupabaseConfigured) return JSON.parse(saved);
      return INITIAL_STORE_PRODUCTS;
    } catch {
      return INITIAL_STORE_PRODUCTS;
    }
  });

  // Homepage Config Management
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => {
    try {
      const saved = localStorage.getItem('sbs_homepage_config');
      return saved ? JSON.parse(saved) : defaultHomepageConfig;
    } catch {
      return defaultHomepageConfig;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sbs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sbs_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currency, setCurrency] = useState<Currency>('XAF');

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('sbs_orders_list');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_ORDERS;
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('sbs_last_order');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_ORDERS[0];
    } catch {
      return null;
    }
  });

  // Reviews State (Sorted newest first)
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('sbs_customer_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.sort((a: Review, b: Review) => b.timestamp - a.timestamp);
      }
      return [...REVIEWS].sort((a, b) => b.timestamp - a.timestamp);
    } catch {
      return [...REVIEWS].sort((a, b) => b.timestamp - a.timestamp);
    }
  });

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTargetOrder, setReviewTargetOrder] = useState<Order | null>(null);
  const [isLiveData, setIsLiveData] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const discountPercent = promoCode ? PROMO_CODES[promoCode] ?? 0 : 0;

  const applyPromo = (code: string) => {
    const c = code.trim().toUpperCase();
    if (PROMO_CODES[c]) {
      setPromoCode(c);
      return true;
    }
    return false;
  };
  const clearPromo = () => setPromoCode('');

  // Chargement du catalogue et des avis depuis Supabase (si configuré)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [remoteProducts, remoteReviews] = await Promise.all([fetchProducts(), fetchReviews()]);
      if (cancelled) return;
      if (remoteProducts && remoteProducts.length > 0) {
        setProducts(remoteProducts);
        setIsLiveData(true);
      }
      if (remoteReviews && remoteReviews.length > 0) setReviews(remoteReviews);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync products
  useEffect(() => {
    try {
      localStorage.setItem('sbs_products_v1', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Sync homepage config
  useEffect(() => {
    try {
      localStorage.setItem('sbs_homepage_config', JSON.stringify(homepageConfig));
    } catch (e) {
      console.error(e);
    }
  }, [homepageConfig]);

  // Sync cart
  useEffect(() => {
    try {
      localStorage.setItem('sbs_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync wishlist
  useEffect(() => {
    try {
      localStorage.setItem('sbs_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Sync orders
  useEffect(() => {
    try {
      localStorage.setItem('sbs_orders_list', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Sync reviews
  useEffect(() => {
    try {
      localStorage.setItem('sbs_customer_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatPrice = (amount: number): string => {
    return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })
      .format(Math.round(amount))
      .replace(/\u202f|\u00a0/g, ' ')} FCFA`;
  };

  // Product CRUD Operations for Admin
  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const merged = { ...p, ...updates };
          // Keep aliases synced
          if (updates.price !== undefined) merged.price = updates.price;
          if (updates.stock !== undefined) {
            merged.stock_count = updates.stock;
            merged.stockCount = updates.stock;
            merged.in_stock = updates.stock > 0;
            merged.inStock = updates.stock > 0;
          }
          if (updates.old_price !== undefined) {
            merged.original_price = updates.old_price;
            merged.originalPrice = updates.old_price;
          }
          return merged;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProductActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p))
    );
  };

  const updateHomepageConfig = (config: Partial<HomepageConfig>) => {
    setHomepageConfig((prev) => ({ ...prev, ...config }));
  };

  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        if (variant) next[existingIndex].selectedVariant = variant;
        return next;
      }
      return [...prev, { product, quantity, selectedVariant: variant }];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = Math.round((cartTotal * discountPercent) / 100);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const addOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    try {
      localStorage.setItem('sbs_last_order', JSON.stringify(newOrder));
    } catch (e) {
      console.error(e);
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updated = {
            ...o,
            status,
            deliveredAt: status === 'Livrée et reçue' ? 'À l’instant' : o.deliveredAt,
          };
          if (activeOrder?.orderId === orderId) setActiveOrder(updated);
          return updated;
        }
        return o;
      })
    );
  };

  const addReview = (newRev: {
    author: string;
    location: string;
    rating: number;
    title: string;
    content: string;
    productName: string;
    photo_url?: string;
  }) => {
    const fullReview: Review = {
      id: 'rev-' + Date.now(),
      author: newRev.author,
      location: newRev.location,
      rating: newRev.rating,
      date: 'À l’instant',
      timestamp: Date.now(),
      title: newRev.title,
      content: newRev.content,
      verifiedPurchase: true,
      productName: newRev.productName,
      photo_url: newRev.photo_url,
    };

    if (isSupabaseConfigured) {
      // L'avis est enregistré en base et publié après validation par SBS
      submitReview(fullReview);
    } else {
      setReviews((prev) => [fullReview, ...prev]);
    }

    if (reviewTargetOrder) {
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === reviewTargetOrder.orderId ? { ...o, hasReviewed: true } : o
        )
      );
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        homepageConfig,
        updateHomepageConfig,
        cart,
        wishlist,
        currency,
        setCurrency,
        formatPrice,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        toggleWishlist,
        isInWishlist,
        currentPath,
        navigate,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        searchQuery,
        setSearchQuery,
        orders,
        addOrder,
        updateOrderStatus,
        activeOrder,
        setActiveOrder,
        reviews,
        addReview,
        reviewModalOpen,
        setReviewModalOpen,
        reviewTargetOrder,
        setReviewTargetOrder,
        isLiveData,
        promoCode,
        discountPercent,
        discountAmount,
        applyPromo,
        clearPromo,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};


/** Produits actifs du catalogue (Supabase si configuré, sinon catalogue local). */
export const useCatalog = (): Product[] => {
  const { products } = useShop();
  return React.useMemo(() => products.filter((p) => p.is_active !== false), [products]);
};
