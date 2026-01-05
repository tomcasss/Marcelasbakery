import { Catalog, Product } from '../components/Catalog';

interface CatalogPageProps {
  onAddToCart: (product: Product) => void;
}

export function CatalogPage({ onAddToCart }: CatalogPageProps) {
  return (
    <div className="py-16">
      <Catalog onAddToCart={onAddToCart} />
    </div>
  );
}
