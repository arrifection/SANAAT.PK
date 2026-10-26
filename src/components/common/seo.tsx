import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

function SEO({ title, description, image, url }: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | SANAAT` : 'SANAAT — Fashion with Modesty';
    document.title = fullTitle;

    const setMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const setOgMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    if (description) {
      setMeta('description', description);
      setOgMeta('og:description', description);
    }

    setOgMeta('og:title', fullTitle);
    setOgMeta('og:type', 'website');

    if (image) {
      setOgMeta('og:image', image);
    }

    if (url) {
      setOgMeta('og:url', url);
    }
  }, [title, description, image, url]);

  return null;
}

export { SEO };
export type { SEOProps };
