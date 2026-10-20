import { useEffect } from 'react';
import { SITE_URL } from '../data/products';

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  jsonLd?: Record<string, unknown>;
}

const setMeta = (attr: 'name' | 'property', key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

const absolute = (url: string) => (url.startsWith('http') ? url : `${SITE_URL}${url}`);

/** Met à jour titre, description, balises Open Graph, URL canonique et données structurées de la page. */
export function useSeo({ title, description, path, image, jsonLd }: SeoOptions) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : '';
  useEffect(() => {
    const fullTitle = title.includes('SBS') ? title : `${title} | SBS SARL Douala`;
    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', absolute(path));
    setMeta('property', 'og:image', absolute(image || '/og-sbs.png'));
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = absolute(path);

    const id = 'page-jsonld';
    document.getElementById(id)?.remove();
    if (ld) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.id = id;
      s.text = ld;
      document.head.appendChild(s);
    }
  }, [title, description, path, image, ld]);
}
