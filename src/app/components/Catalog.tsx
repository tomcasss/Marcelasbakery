import { Plus, Search } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface CatalogProps {
  onAddToCart: (product: Product) => void;
}

const categories = [
  'Todos',
  'Acompañamientos',
  'Platos Fuertes',
  'Proteínas',
  'Postres',
  'Rompopes'
];

const products: Product[] = [
  // Acompañamientos
  {
    id: 1,
    name: 'Arroz con Vegetales',
    description: 'Arroz blanco salteado con vegetales frescos de temporada',
    price: 3500,
    category: 'Acompañamientos',
    image: 'https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 2,
    name: 'Ensalada Fresca',
    description: 'Mix de lechugas frescas con aderezo de la casa',
    price: 2800,
    category: 'Acompañamientos',
    image: 'https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 3,
    name: 'Papas Doradas',
    description: 'Papas al horno doradas con especias',
    price: 3000,
    category: 'Acompañamientos',
    image: 'https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  // Platos Fuertes
  {
    id: 4,
    name: 'Pasta Alfredo',
    description: 'Pasta fettuccine en salsa alfredo cremosa',
    price: 6500,
    category: 'Platos Fuertes',
    image: 'https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 5,
    name: 'Lasagna Bolognesa',
    description: 'Capas de pasta con carne molida y quesos gratinados',
    price: 7200,
    category: 'Platos Fuertes',
    image: 'https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 6,
    name: 'Casado Tradicional',
    description: 'Arroz, frijoles, ensalada, plátano y tortilla',
    price: 5500,
    category: 'Platos Fuertes',
    image: 'https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  // Proteínas
  {
    id: 7,
    name: 'Pollo a la Plancha',
    description: 'Pechuga de pollo marinada y a la plancha',
    price: 4500,
    category: 'Proteínas',
    image: 'https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 8,
    name: 'Carne en Salsa',
    description: 'Carne de res en salsa especial de la casa',
    price: 5800,
    category: 'Proteínas',
    image: 'https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 9,
    name: 'Pescado al Ajillo',
    description: 'Filete de pescado fresco al ajillo con hierbas',
    price: 6800,
    category: 'Proteínas',
    image: 'https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  // Postres
  {
    id: 10,
    name: 'Tres Leches',
    description: 'Bizcocho empapado en tres tipos de leche',
    price: 4200,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1753889076214-d888f2326bea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGVzc2VydHN8ZW58MXx8fHwxNzY2NTM2NjM2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 11,
    name: 'Cheesecake de Frutos Rojos',
    description: 'Cremoso cheesecake con coulis de frutos rojos',
    price: 4800,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1753889076214-d888f2326bea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGVzc2VydHN8ZW58MXx8fHwxNzY2NTM2NjM2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 12,
    name: 'Tiramisú',
    description: 'Clásico postre italiano con café y mascarpone',
    price: 5200,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1753889076214-d888f2326bea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGVzc2VydHN8ZW58MXx8fHwxNzY2NTM2NjM2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 13,
    name: 'Flan de Caramelo',
    description: 'Suave flan casero con caramelo líquido',
    price: 3500,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1753889076214-d888f2326bea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGVzc2VydHN8ZW58MXx8fHwxNzY2NTM2NjM2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  // Rompopes
  {
    id: 14,
    name: 'Rompope Tradicional',
    description: 'Rompope casero con receta familiar (750ml)',
    price: 8500,
    category: 'Rompopes',
    image: 'https://images.unsplash.com/photo-1696721497670-d57754966c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBwYXN0cmllc3xlbnwxfHx8fDE3NjY0ODMzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 15,
    name: 'Rompope de Coco',
    description: 'Rompope con delicioso sabor a coco (750ml)',
    price: 9000,
    category: 'Rompopes',
    image: 'https://images.unsplash.com/photo-1696721497670-d57754966c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBwYXN0cmllc3xlbnwxfHx8fDE3NjY0ODMzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
];

export function Catalog({ onAddToCart }: CatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

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
          <h2 className="text-4xl text-[#ce733e] mb-4">Catálogo</h2>
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
              className="w-full pl-12 pr-4 py-3 rounded-md border-2 border-[#ce733e] focus:outline-none focus:border-[#b35f2f]"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-md transition-all ${
                selectedCategory === category
                  ? 'bg-[#ce733e] text-white'
                  : 'bg-white text-gray-700 border-2 border-[#ce733e] hover:bg-[#FFF8F0]'
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
              className="bg-white rounded-lg overflow-hidden border-2 border-[#ce733e] hover:shadow-lg transition-all"
            >
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-[#ce733e] text-white px-3 py-1 rounded-md text-sm">
                  {product.category}
                </div>
              </div>
              <div className="p-5 bg-[#FFF8F0]">
                <h3 className="text-lg text-[#ce733e] mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl text-[#ce733e]">
                    ₡{product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="bg-[#ce733e] text-white p-2.5 rounded-md hover:bg-[#b35f2f] transition-all"
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