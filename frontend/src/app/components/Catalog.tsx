import { Plus, Search } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';

export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface CatalogProps {
  onAddToCart: (product: Product) => void;
}

// Fotos locales (se usan como fallback si la DB está vacía)
const foto = (n: number) => `/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_${String(n).padStart(4, '0')}.JPG`;

const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: 'Arroz con Vegetales', description: 'Arroz blanco salteado con vegetales frescos de temporada', price: 3500, category: 'Acompañamientos', image: foto(1) },
  { id: 2, name: 'Ensalada Fresca', description: 'Mix de lechugas frescas con aderezo de la casa', price: 2800, category: 'Acompañamientos', image: foto(2) },
  { id: 3, name: 'Papas Doradas', description: 'Papas al horno doradas con especias', price: 3000, category: 'Acompañamientos', image: foto(3) },
  { id: 4, name: 'Pasta Alfredo', description: 'Pasta fettuccine en salsa alfredo cremosa', price: 6500, category: 'Platos Fuertes', image: foto(4) },
  { id: 5, name: 'Lasagna Bolognesa', description: 'Capas de pasta con carne molida y quesos gratinados', price: 7200, category: 'Platos Fuertes', image: foto(5) },
  { id: 6, name: 'Casado Tradicional', description: 'Arroz, frijoles, ensalada, plátano y tortilla', price: 5500, category: 'Platos Fuertes', image: foto(6) },
  { id: 7, name: 'Pollo a la Plancha', description: 'Pechuga de pollo marinada y a la plancha', price: 4500, category: 'Proteínas', image: foto(7) },
  { id: 8, name: 'Carne en Salsa', description: 'Carne de res en salsa especial de la casa', price: 5800, category: 'Proteínas', image: foto(8) },
  { id: 9, name: 'Pescado al Ajillo', description: 'Filete de pescado fresco al ajillo con hierbas', price: 6800, category: 'Proteínas', image: foto(9) },
  { id: 10, name: 'Tres Leches', description: 'Bizcocho empapado en tres tipos de leche', price: 4200, category: 'Postres', image: foto(10) },
  { id: 11, name: 'Cheesecake de Frutos Rojos', description: 'Cremoso cheesecake con coulis de frutos rojos', price: 4800, category: 'Postres', image: foto(11) },
  { id: 12, name: 'Tiramisú', description: 'Clásico postre italiano con café y mascarpone', price: 5200, category: 'Postres', image: foto(12) },
  { id: 13, name: 'Flan de Caramelo', description: 'Suave flan casero con caramelo líquido', price: 3500, category: 'Postres', image: foto(13) },
  { id: 14, name: 'Rompope Tradicional', description: 'Rompope casero con receta familiar (750ml)', price: 8500, category: 'Rompopes', image: foto(14) },
  { id: 15, name: 'Rompope de Coco', description: 'Rompope con delicioso sabor a coco (750ml)', price: 9000, category: 'Rompopes', image: foto(15) },
];

export function Catalog({ onAddToCart }: CatalogProps) {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar productos desde la API; si falla o está vacío, usar los locales
  useEffect(() => {
    fetchProducts()
      .then((data) => {
        if (data.length > 0) {
          setProducts(data.map((p: any) => ({ ...p, id: p._id ?? p.id })));
        }
      })
      .catch(() => { /* sin conexión: usar DEFAULT_PRODUCTS */ });
  }, []);

  const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-gray-900 mb-4">Catálogo</h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            Descubre nuestra deliciosa selección de platillos preparados con amor
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-[#cd733d] focus:outline-none focus:ring-2 focus:ring-[#cd733d]/50 focus:border-[#cd733d]"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-lg transition-all font-semibold ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border-2 border-[#cd733d] hover:bg-[#FFF8F0] hover:scale-105'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden border-2 border-[#cd733d]/20 hover:border-[#cd733d] hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md">
                  {product.category}
                </div>
              </div>
              <div className="p-5 bg-gradient-to-br from-[#FFF8F0] to-white">
                <h3 className="text-lg font-semibold text-[#cd733d] mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#cd733d]">
                    ₡{product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white p-2.5 rounded-lg hover:shadow-lg hover:scale-110 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No se encontraron productos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </section>
  );
}