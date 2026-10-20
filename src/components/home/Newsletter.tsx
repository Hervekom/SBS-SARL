import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubmitted(true);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#111111] text-[#FFFFFF] relative overflow-hidden">
      {/* Subtle gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#F26B1D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A017]/20 text-[#D4A017] text-xs font-semibold">
          <Mail className="w-3.5 h-3.5" />
          <span>LE CLUB SBS</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
          Recevez nos arrivages et bons plans, et -10% sur votre première commande.
        </h2>

        <p className="text-sm text-neutral-300 max-w-xl mx-auto font-light leading-relaxed">
          Soyez prévenu en premier des nouveaux téléphones, des destockages et des promos accessoires.
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
            <div className="relative w-full">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email personnelle..."
                className="w-full px-4 py-3 bg-[#1C1C1C] border border-[#333333] focus:border-[#F26B1D] rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#F26B1D]"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#F26B1D] hover:bg-[#C2410C] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>S'inscrire</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="bg-[#1C1C1C] border border-[#F26B1D]/40 p-4 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-3 text-sm text-[#F26B1D] animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-medium text-white">
              Bienvenue ! Votre code promo <strong className="text-[#D4A017] font-mono">SBS10</strong> est activé.
            </span>
          </div>
        )}

        <p className="text-[11px] text-neutral-500">
          Zéro spam. Désabonnement possible en 1 clic à tout moment.
        </p>
      </div>
    </section>
  );
};
