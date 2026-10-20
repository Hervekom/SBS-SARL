import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
}

/**
 * Logo SBS SARL : pictogramme (logo provisoire issu de la page Facebook)
 * + mot-symbole typographique. variant="light" = sur fond noir.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md', variant = 'dark' }) => {
  const iconSize = { sm: 'w-9 h-9', md: 'w-11 h-11', lg: 'w-12 h-12', xl: 'w-14 h-14' }[size];
  const titleSize = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl', xl: 'text-3xl' }[size];
  const isLight = variant === 'light';

  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <span className={`${iconSize} rounded-full bg-white overflow-hidden shrink-0 flex items-center justify-center ${isLight ? 'ring-2 ring-[#D4A017]/60' : 'ring-1 ring-[#EAEAEA]'}`}>
        <img
          src="/logo-sbs-icon.png"
          alt="Smart Business Services SARL"
          className="w-full h-full object-contain scale-110"
          loading="eager"
        />
      </span>
      <span className="flex flex-col leading-none text-left">
        <span className={`${titleSize} font-extrabold tracking-tight ${isLight ? 'text-white' : 'text-[#111111]'}`}>
          SBS<span className="text-[#F26B1D]"> SARL</span>
        </span>
        <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.22em] mt-1 ${isLight ? 'text-[#D4A017]' : 'text-[#B8860B]'}`}>
          Smart Business Services
        </span>
      </span>
    </span>
  );
};
