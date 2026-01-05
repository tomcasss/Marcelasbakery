import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div>
      {/* Hero Section - Similar al original */}
      <section className="bg-[#F4CE14] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl text-gray-900 mb-6">
              Bienvenidos a La Gracia by Marcela's Bakery
            </h1>
            <p className="text-xl text-gray-800 mb-8">
              Restaurant & Catering Service - Comida casera preparada con amor
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/catalogo"
                className="bg-[#ce733e] text-white px-8 py-3 rounded-md hover:bg-[#b35f2f] transition-colors"
              >
                Descargar Catálogo
              </Link>
              <a
                href="https://wa.me/50684152888"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#ce733e] border-2 border-[#ce733e] px-8 py-3 rounded-md hover:bg-[#ce733e] hover:text-white transition-colors"
              >
                WhatsApp: 8415-2888
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-[#ce733e] text-center mb-12">
            Nuestras Categorías
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: 'Acompañamientos', img: 'https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080' },
              { name: 'Platos Fuertes', img: 'https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080' },
              { name: 'Proteínas', img: 'https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080' },
              { name: 'Postres', img: 'https://images.unsplash.com/photo-1753889076214-d888f2326bea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGVzc2VydHN8ZW58MXx8fHwxNzY2NTM2NjM2fDA&ixlib=rb-4.1.0&q=80&w=1080' },
              { name: 'Rompopes', img: 'https://images.unsplash.com/photo-1696721497670-d57754966c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBwYXN0cmllc3xlbnwxfHx8fDE3NjY0ODMzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
            ].map((category) => (
              <Link
                key={category.name}
                to="/catalogo"
                className="bg-white border-2 border-[#ce733e] rounded-lg overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="h-40 bg-gray-100">
                  <ImageWithFallback
                    src={category.img}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 bg-[#FFF8F0] text-center">
                  <h3 className="text-lg text-[#ce733e]">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-[#FFF8F0]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl text-[#ce733e] mb-6">
              Comida Casera con Sabor Auténtico
            </h2>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              En La Gracia by Marcela's Bakery nos dedicamos a preparar comida casera con 
              el mismo amor y dedicación que pondrías en tu propia cocina. Cada platillo 
              es preparado con ingredientes frescos y recetas tradicionales.
            </p>
            <Link
              to="/sobre-nosotros"
              className="inline-block bg-[#ce733e] text-white px-8 py-3 rounded-md hover:bg-[#b35f2f] transition-colors"
            >
              Conocer Más
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#ce733e] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl mb-4">¿Necesitas catering para tu evento?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Ofrecemos servicios completos de catering: celebraciones, salas de eventos, 
            mobiliario, animación, decoración y mucho más
          </p>
          <Link
            to="/catering"
            className="inline-block bg-white text-[#ce733e] px-8 py-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            Ver Servicios de Catering
          </Link>
        </div>
      </section>
    </div>
  );
}
