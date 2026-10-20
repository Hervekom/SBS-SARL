import React, { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { trackOrder, TrackedOrder, isSupabaseConfigured } from '../lib/supabase';
import { whatsappLink } from '../data/products';
import { Search, Package, Truck, CheckCircle2, XCircle, Loader2, MessageCircle } from 'lucide-react';

const STEPS = ['En préparation', 'En transit', 'Livrée et reçue'];

export const TrackingPage: React.FC = () => {
  const { currentPath, formatPrice } = useShop();
  const initialId = new URLSearchParams(currentPath.split('?')[1] || '').get('commande') || '';
  const [orderId, setOrderId] = useState(initialId);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackedOrder | null | 'error' | undefined>(undefined);

  useEffect(() => {
    setOrderId(initialId);
  }, [initialId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || phone.replace(/\D/g, '').length < 6) return;
    setLoading(true);
    setResult(await trackOrder(orderId, phone));
    setLoading(false);
  };

  const stepIndex = result && result !== 'error' ? STEPS.indexOf(result.status) : -1;

  return (
    <div className="bg-porcelain min-h-[70vh] py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl">Suivre ma commande</h1>
        <p className="mt-2 text-ink/60">Entrez le numéro de commande (ex : SBS-123456) et le téléphone utilisé lors de l’achat.</p>

        {!isSupabaseConfigured ? (
          <p className="mt-6 text-sm text-ink/60">Le suivi en ligne sera disponible une fois la boutique connectée à sa base de données.</p>
        ) : (
          <form onSubmit={submit} className="mt-6 bg-white rounded-2xl border border-ink/10 p-5 sm:p-6 grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <label className="block">
              <span className="text-sm font-medium">N° de commande</span>
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="SBS-123456"
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-ink/15 text-sm uppercase focus:outline-none focus:border-brand"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Téléphone</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="6 XX XX XX XX"
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-ink/15 text-sm focus:outline-none focus:border-brand"
              />
            </label>
            <button className="h-[46px] px-5 rounded-xl bg-brand hover:bg-brand-hover text-white text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Rechercher
            </button>
          </form>
        )}

        {result === null && (
          <p className="mt-6 text-sm text-ink/70">
            Aucune commande ne correspond à ces informations. Vérifiez le numéro, ou{' '}
            <a className="text-brand-dark font-semibold underline" href={whatsappLink(`Bonjour SBS SARL, je cherche ma commande ${orderId}.`)} target="_blank" rel="noopener noreferrer">
              écrivez-nous sur WhatsApp
            </a>
            .
          </p>
        )}
        {result === 'error' && <p className="mt-6 text-sm text-red-600">Le suivi est momentanément indisponible. Réessayez dans un instant.</p>}

        {result && result !== 'error' && (
          <div className="mt-6 bg-white rounded-2xl border border-ink/10 p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-2xl">{result.id}</h2>
              <span className="text-sm text-ink/55">
                Passée le {new Date(result.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            {result.status === 'Annulée' ? (
              <p className="mt-5 inline-flex items-center gap-2 text-red-700 font-semibold">
                <XCircle className="w-5 h-5" /> Commande annulée
              </p>
            ) : (
              <ol className="mt-6 grid grid-cols-3 gap-2">
                {STEPS.map((s, i) => {
                  const Icon = [Package, Truck, CheckCircle2][i];
                  const done = i <= stepIndex;
                  return (
                    <li key={s} className="text-center">
                      <span className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center ${done ? 'bg-brand text-white' : 'bg-ink/5 text-ink/35'}`}>
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className={`mt-2 block text-xs ${done ? 'text-ink font-semibold' : 'text-ink/45'}`}>{s}</span>
                    </li>
                  );
                })}
              </ol>
            )}

            <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10 text-sm">
              {result.items.map((i, idx) => (
                <li key={idx} className="py-2.5 flex justify-between gap-3">
                  <span>
                    {i.quantity} × {i.name}
                    {i.variant && <span className="text-ink/45"> · {i.variant}</span>}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-ink/50">Total</dt>
                <dd className="font-semibold">{formatPrice(result.total_amount)}</dd>
              </div>
              <div>
                <dt className="text-ink/50">Livraison</dt>
                <dd>{result.shipping_method}</dd>
              </div>
              <div>
                <dt className="text-ink/50">Paiement</dt>
                <dd>{result.payment_method}</dd>
              </div>
            </dl>
            <a
              href={whatsappLink(`Bonjour SBS SARL, j’ai une question sur ma commande ${result.id}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/15 hover:border-ink/40 px-5 py-2.5 text-sm font-semibold"
            >
              <MessageCircle className="w-4 h-4" /> Une question sur cette commande
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
