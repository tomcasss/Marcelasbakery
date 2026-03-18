import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchSiteConfig } from '../services/api';

export interface SiteImages {
  about_image: string;
  catering_image: string;
  carousel_image_1: string;
  carousel_image_2: string;
  carousel_image_3: string;
  carousel_image_4: string;
  carousel_image_5: string;
  category_acompanamientos: string;
  category_platos_fuertes: string;
  category_proteinas: string;
  category_postres: string;
  category_rompopes: string;
}

const DEFAULTS: SiteImages = {
  about_image:
    'https://images.unsplash.com/photo-1657498023828-1e0181449d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjY1MjEwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  catering_image:
    'https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080',
  carousel_image_1: '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0001.JPG',
  carousel_image_2: '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0002.JPG',
  carousel_image_3: '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0003.JPG',
  carousel_image_4: '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0004.JPG',
  carousel_image_5: '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0005.JPG',
  category_acompanamientos: '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0001.JPG',
  category_platos_fuertes:  '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0004.JPG',
  category_proteinas:       '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0007.JPG',
  category_postres:         '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0010.JPG',
  category_rompopes:        '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0014.JPG',
};

const SiteConfigContext = createContext<SiteImages>(DEFAULTS);

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<SiteImages>(DEFAULTS);

  useEffect(() => {
    fetchSiteConfig()
      .then((data) => {
        setImages((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {
        // silently fall back to defaults
      });
  }, []);

  return (
    <SiteConfigContext.Provider value={images}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export const useSiteImages = () => useContext(SiteConfigContext);
