import React, { useMemo, useState } from 'react';
import {
  Check,
  ChevronRight,
  Plus,
  Minus,
  MessageCircle,
  ShieldCheck,
  BadgeCheck,
  Headphones,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useShop, useCatalog } from '../context/ShopContext';
import { CATEGORIES, SHOP, heroBannerImg, whatsappLink } from '../data/products';
import { ProductCard } from '../components/products/ProductCard';
import { CategoryId } from '../types';

// ---------------------------------------------------------------------------
// Briques de mise en page (style éditorial)
// ---------------------------------------------------------------------------
const Section: React.FC<{ id?: string; className?: string; children: React.ReactNode }> = ({ id, className = '', children }) => (
  <section id={id} className={`scroll-mt-24 py-16 sm:py-24 ${className}`}>
    <div className="max-w-6xl mx-auto px-4 sm:px-6">{children}</div>
  </section>
);

const Heading: React.FC<{ title: string; subtitle?: string; tone?: 'light' | 'dark'; className?: string }> = ({
  title,
  subtitle,
  tone = 'light',
  className = '',
}) => (
  <div className={`max-w-2xl ${className}`}>
    <h2 className={`text-3xl sm:text-[44px] leading-[1.1] ${tone === 'dark' ? 'text-white' : 'text-ink'}`}>{title}</h2>
    {subtitle && (
      <p className={`mt-4 text-base sm:text-lg leading-relaxed ${tone === 'dark' ? 'text-white/70' : 'text-ink/65'}`}>{subtitle}</p>
    )}
  </div>
);

const STEPS = [
  { title: 'Choisissez', text: 'Parcourez nos rayons ou demandez conseil : on vous oriente vers le modèle adapté à votre budget.' },
  { title: 'Commandez', text: 'Validez votre panier sur le site ou envoyez-nous la référence sur WhatsApp en un message.' },
  { title: 'Recevez', text: 'Livraison en 24 h à Douala, expédition par agence vers les autres villes, ou retrait en boutique.' },
  { title: 'Payez à la réception', text: 'Vous vérifiez le produit devant le livreur, puis vous payez en espèces ou par Mobile Money.' },
];

const INCLUDED = [
  'Téléphones neufs et scellés',
  'Test de l’appareil devant vous',
  'Facture avec numéro IMEI',
  'Garantie boutique sur les téléphones',
  'Pose du verre trempé offerte',
  'Transfert de vos données sur demande',
  'Livraison 24 h à Douala',
  'Expédition par agence au Cameroun',
  'Paiement espèces, Orange Money, MTN MoMo',
  'Conseil avant et après l’achat',
];

const FAQ = [
  {
    q: 'Vos téléphones sont-ils neufs ?',
    a: 'Oui. Les téléphones vendus sont neufs et scellés. Le carton est ouvert devant vous, l’appareil est testé et vous repartez avec une facture mentionnant l’IMEI.',
  },
  {
    q: 'Livrez-vous en dehors de Douala ?',
    a: 'Oui. À Douala, la livraison se fait sous 24 h. Pour Yaoundé et les autres villes, nous expédions par agence de voyage en 24 à 72 h après paiement Mobile Money.',
  },
  {
    q: 'Comment puis-je payer ?',
    a: 'En espèces à la livraison (Douala), par Orange Money ou par MTN Mobile Money. Le numéro marchand vous est envoyé après validation de la commande.',
  },
  {
    q: 'La pose du verre trempé est-elle vraiment gratuite ?',
    a: 'Oui, pour tout verre trempé acheté chez SBS, la pose est offerte en boutique.',
  },
  {
    q: 'Que faire si le produit a un défaut ?',
    a: 'Contactez-nous sur WhatsApp sous 7 jours avec une photo ou une vidéo du problème. Le produit est échangé selon les conditions de la boutique.',
  },
];

// ---------------------------------------------------------------------------
// Page d'accueil
// ---------------------------------------------------------------------------
export const HomePage: React.FC = () => {
  const { navigate, formatPrice, setSearchQuery, reviews } = useShop();
  const PRODUCTS = useCatalog();
  const [tab, setTab] = useState<CategoryId | 'top'>('top');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const heroPicks = useMemo(
    () => ['prod-iphone-15-pro-max', 'prod-galaxy-a55', 'prod-powerbank-20000']
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [PRODUCTS]
  );

  const gridProducts = useMemo(() => {
    const list = tab === 'top' ? PRODUCTS.filter((p) => p.is_popular) : PRODUCTS.filter((p) => p.category_id === tab);
    return list.slice(0, 8);
  }, [PRODUCTS, tab]);

  const deals = useMemo(
    () => PRODUCTS.filter((p) => p.old_price && p.old_price > p.price)
      .sort((a, b) => (b.old_price! - b.price) / b.old_price! - (a.old_price! - a.price) / a.old_price!)
      .slice(0, 3),
    [PRODUCTS]
  );

  const countFor = (id: CategoryId) => PRODUCTS.filter((p) => p.category_id === id).length;

  const brands = [
    { name: 'Apple', hint: 'iPhone, Apple Watch, AirPods' },
    { name: 'Samsung', hint: 'Galaxy S, Galaxy A, Galaxy Watch, chargeurs' },
    { name: 'Tecno', hint: 'Camon, Spark, Pova' },
    { name: 'Infinix', hint: 'Note, Hot, Zero' },
    { name: 'Xiaomi', hint: 'Redmi Note, Smart Band' },
    { name: 'SBS Accessoires', hint: 'Coques, verres trempés, câbles, power banks' },
  ];

  return (
    <div className="bg-porcelain text-ink">
      {/* ================= HERO ================= */}
      <section className="relative isolate overflow-hidden bg-ink">
        <img
          src={heroBannerImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-y-0 right-0 -z-10 h-full w-full lg:w-[58%] object-cover object-center opacity-40 lg:opacity-90"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/85 via-ink/75 to-ink/95 lg:bg-gradient-to-r lg:from-ink lg:from-45% lg:via-ink/80 lg:to-ink/20" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-36 pb-16 sm:pt-44 sm:pb-24 lg:min-h-[88vh] grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div className="text-white">
            <p className="text-sm font-medium text-white/75">Boutique d’électronique à {SHOP.city}</p>
            <h1 className="mt-4 text-[40px] leading-[1.05] sm:text-6xl lg:text-[66px] max-w-[15ch]">
              Votre téléphone et ses accessoires, <span className="text-brand">au même endroit.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
              Smartphones neufs, pochettes, verres trempés, montres connectées, chargeurs auto et gadgets. Conseil honnête,
              livraison rapide à Douala et paiement à la réception.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/smartphones')}
                className="inline-flex items-center justify-center rounded-full bg-brand hover:bg-brand-hover px-6 py-3.5 text-sm font-semibold text-white transition-colors cursor-pointer"
              >
                Voir les téléphones
              </button>
              <a
                href={whatsappLink('Bonjour SBS SARL, je cherche un téléphone / un accessoire.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 hover:border-white px-6 py-3.5 text-sm font-semibold text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Demander conseil
              </a>
            </div>
            <ul className="mt-8 space-y-2.5 text-sm text-white/80">
              {['Téléphones neufs et scellés, testés devant vous', 'Pose du verre trempé offerte', 'Espèces, Orange Money ou MTN MoMo'].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gold/25 text-gold-light flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Carte flottante : les plus demandés */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/30 text-ink">
            <h2 className="text-xl">Les plus demandés</h2>
            <div className="mt-4 divide-y divide-ink/10">
              {heroPicks.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/produit/${p.slug}`)}
                  className="w-full flex items-center gap-3 py-3 text-left cursor-pointer group"
                >
                  <img src={p.image} alt="" className="w-14 h-14 rounded-xl object-cover bg-[#F4F2EF] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-ink/50">{p.sub_category}</p>
                    <p className="text-sm font-semibold leading-snug line-clamp-1 group-hover:text-brand-dark">{p.name}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#1F7A5C] bg-[#E8F5EF] rounded-full px-2 py-0.5 shrink-0">En stock</span>
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-blush px-4 py-3.5">
              <p className="text-sm text-ink/70">
                À partir de{' '}
                <span className="font-display text-2xl font-semibold text-brand-dark">
                  {formatPrice(Math.min(...PRODUCTS.map((p) => p.price)))}
                </span>
              </p>
              <p className="text-xs text-ink/50 mt-0.5">Livraison offerte à Douala dès 50 000 FCFA</p>
            </div>
            <button
              onClick={() => navigate('/promotions')}
              className="mt-5 w-full rounded-full bg-ink hover:bg-black text-white text-sm font-semibold py-3.5 transition-colors cursor-pointer"
            >
              Voir les promotions
            </button>
          </div>
        </div>
      </section>

      {/* ================= CHIFFRES CLÉS ================= */}
      <section className="bg-blush">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { v: `${CATEGORIES.length} rayons`, l: 'Téléphones, protection, montres, chargeurs & gadgets' },
            { v: '24 h', l: 'Délai de livraison à Douala' },
            { v: '0 FCFA', l: 'Pour la pose de votre verre trempé' },
            { v: '3 moyens', l: 'Espèces, Orange Money et MTN MoMo' },
          ].map((s) => (
            <div key={s.v}>
              <p className="font-display text-3xl sm:text-4xl font-semibold text-brand-dark">{s.v}</p>
              <p className="mt-1.5 text-sm text-ink/60 leading-snug max-w-[24ch]">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= COMMENT COMMANDER ================= */}
      <Section id="commander" className="bg-ink">
        <Heading tone="dark" title="Comment commander" subtitle="Quatre étapes simples. Vous ne payez qu’après avoir vu votre produit." />
        <ol className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-brand text-white font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
                {i < STEPS.length - 1 && <span className="hidden lg:block h-px flex-1 bg-white/15" />}
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{s.text}</p>
            </li>
          ))}
        </ol>
        <button
          onClick={() => navigate('/smartphones')}
          className="mt-12 inline-flex items-center rounded-full bg-white hover:bg-blush px-6 py-3 text-sm font-semibold text-ink transition-colors cursor-pointer"
        >
          Commencer mes achats
        </button>
      </Section>

      {/* ================= RAYONS ================= */}
      <Section id="rayons">
        <Heading title="Trouvez ce qu’il vous faut" subtitle="Le téléphone, sa protection, sa recharge et ses compagnons connectés." />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/${c.slug}`)}
              className="group text-left bg-white rounded-2xl border border-ink/10 overflow-hidden hover:border-ink/20 hover:shadow-[0_12px_30px_-12px_rgba(23,18,14,0.18)] transition-all cursor-pointer flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#F4F2EF]">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-brand-dark font-medium">{countFor(c.id)} références</p>
                <h3 className="mt-1 font-display text-lg font-semibold">{c.name}</h3>
                <p className="mt-2 text-sm text-ink/60 leading-relaxed flex-1">{c.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-dark">
                  Voir le rayon <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </button>
          ))}
        </div>

        <h3 className="mt-16 font-display text-xl font-semibold">Nos marques</h3>
        <div className="mt-4 grid md:grid-cols-2 gap-x-12 border-t border-ink/10">
          {brands.map((b) => (
            <button
              key={b.name}
              onClick={() => setSearchQuery(b.name === 'SBS Accessoires' ? 'SBS' : b.name)}
              className="flex items-center justify-between gap-4 py-4 border-b border-ink/10 text-left group cursor-pointer"
            >
              <span>
                <span className="block text-sm font-semibold group-hover:text-brand-dark">{b.name}</span>
                <span className="block text-xs text-ink/55 mt-0.5">{b.hint}</span>
              </span>
              <ChevronRight className="w-4 h-4 text-ink/35 group-hover:text-brand-dark shrink-0" />
            </button>
          ))}
        </div>
      </Section>

      {/* ================= PRODUITS ================= */}
      <Section id="produits" className="bg-white">
        <div className="flex flex-col gap-6">
          <Heading title="Nos produits phares" subtitle="Les références que nos clients achètent le plus souvent." />
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {[{ id: 'top' as const, label: 'Top ventes' }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.name }))].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  tab === t.id ? 'bg-ink text-white' : 'text-ink/70 hover:bg-blush'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {gridProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* ================= OFFRES ================= */}
      <Section id="offres" className="bg-blush">
        <Heading title="Les offres du moment" subtitle="De vraies remises, dans la limite des stocks disponibles." />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((p, i) => (
            <button
              key={p.id}
              onClick={() => navigate(`/produit/${p.slug}`)}
              className="text-left bg-white rounded-2xl p-5 border border-ink/5 hover:border-ink/15 transition-colors cursor-pointer flex flex-col"
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-blush text-brand-dark text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                <span className="text-xs font-semibold text-brand-dark">
                  -{Math.round(((p.old_price! - p.price) / p.old_price!) * 100)}%
                </span>
              </div>
              <p className="mt-4 text-sm text-ink/60 line-clamp-1">{p.name}</p>
              <p className="mt-1 font-display text-3xl font-semibold">{formatPrice(p.price)}</p>
              <p className="mt-1 text-sm text-ink/45 line-through">{formatPrice(p.old_price!)}</p>
            </button>
          ))}
          <div className="rounded-2xl bg-brand text-white p-5 flex flex-col">
            <p className="text-sm text-white/85">Code de bienvenue</p>
            <p className="mt-1 font-display text-4xl font-semibold">{SHOP.promoCode}</p>
            <p className="mt-1 text-sm text-white/85">-10 % sur votre commande</p>
            <button
              onClick={() => navigate('/promotions')}
              className="mt-6 self-start inline-flex items-center gap-1.5 rounded-full bg-white text-ink text-sm font-semibold px-5 py-2.5 hover:bg-blush transition-colors cursor-pointer"
            >
              Voir toutes les promos
            </button>
          </div>
        </div>
      </Section>

      {/* ================= INCLUS ================= */}
      <Section>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
          <Heading title="Inclus avec chaque achat" subtitle="Pas d’options cachées : le service fait partie du prix." />
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3.5 content-start">
            {INCLUDED.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-sm text-ink/80">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ================= QUI SOMMES-NOUS ================= */}
      <Section id="apropos" className="bg-white">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="rounded-3xl overflow-hidden bg-[#F4F2EF] aspect-[4/3]">
            <img src={CATEGORIES[0].image} alt="Téléphones disponibles chez SBS SARL" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-[44px] leading-[1.1]">Qui sommes-nous</h2>
            <p className="mt-5 text-base text-ink/70 leading-relaxed">
              Smart Business Services SARL est une boutique d’électronique installée à Douala. Nous vendons des téléphones
              et tous les accessoires qui vont avec, pour les particuliers comme pour les professionnels.
            </p>
            <p className="mt-4 text-base text-ink/70 leading-relaxed">
              Notre règle est simple : des produits authentiques, des prix clairs et une équipe joignable avant comme après
              l’achat.
            </p>
            <div className="mt-8 border-t border-ink/10">
              {[
                { icon: ShieldCheck, t: 'Authentique', d: 'Produits neufs, vérifiés et facturés.' },
                { icon: BadgeCheck, t: 'Transparent', d: 'Prix affichés, aucun frais caché.' },
                { icon: Headphones, t: 'Disponible', d: 'Conseil et suivi sur WhatsApp et en boutique.' },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="flex items-start gap-3 py-4 border-b border-ink/10">
                  <Icon className="w-5 h-5 text-brand-dark mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{t}</p>
                    <p className="text-sm text-ink/55">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ================= AVIS ================= */}
      {reviews.length > 0 && (
        <Section id="avis">
          <Heading title="Ce que disent nos clients" subtitle="Avis de démonstration, remplacés par les vrais retours des clients SBS." />
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            {reviews.slice(0, 3).map((r) => (
              <figure key={r.id} className="bg-white rounded-2xl border border-ink/10 p-6 flex flex-col">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-gold' : 'text-ink/15'}`} />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm text-ink/75 leading-relaxed flex-1">« {r.content} »</blockquote>
                <figcaption className="mt-5 pt-4 border-t border-ink/10">
                  <p className="text-sm font-semibold">{r.author}</p>
                  <p className="text-xs text-ink/50">
                    {r.location} · {r.productName}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {/* ================= FAQ ================= */}
      <Section id="faq" className="bg-white">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
          <div>
            <h2 className="text-3xl sm:text-[44px] leading-[1.1]">Questions fréquentes</h2>
            <p className="mt-4 text-base text-ink/65 leading-relaxed">Vous ne trouvez pas votre réponse ? Écrivez-nous sur WhatsApp.</p>
            <a
              href={whatsappLink('Bonjour SBS SARL, j’ai une question.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/15 hover:border-ink/40 px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Poser une question
            </a>
          </div>
          <div className="border-t border-ink/10">
            {FAQ.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="border-b border-ink/10">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
                    aria-expanded={open}
                  >
                    <span className="text-sm sm:text-base font-semibold">{f.q}</span>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${open ? 'bg-brand text-white' : 'bg-blush text-brand-dark'}`}>
                      {open ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                  {open && <p className="pb-5 -mt-1 text-sm text-ink/65 leading-relaxed pr-10">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ================= APPEL FINAL ================= */}
      <section className="bg-ink">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl text-white leading-tight">Besoin d’un conseil avant d’acheter ?</h2>
            <p className="mt-3 text-white/70">Dites-nous votre budget et votre usage, on vous propose les meilleurs choix en quelques minutes.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={whatsappLink('Bonjour SBS SARL, j’aimerais un conseil.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand hover:bg-brand-hover px-6 py-3.5 text-sm font-semibold text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Écrire sur WhatsApp
            </a>
            <button
              onClick={() => navigate('/smartphones')}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 hover:border-white px-6 py-3.5 text-sm font-semibold text-white transition-colors cursor-pointer"
            >
              Voir le catalogue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
