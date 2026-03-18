import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShoppingBag, Phone } from 'lucide-react';

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="pt-20 min-h-screen flex items-center bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF4E8] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#D97548]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#F4D19B]/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <span className="bg-gradient-to-r from-[#D97548] to-[#E8A87C] text-white px-6 py-2 rounded-full text-sm font-medium shadow-md">
                Restaurant & Catering Service
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-serif text-gray-900 leading-tight">
              Sabor auténtico para tus
              <span className="text-[#D97548] block mt-2">momentos especiales</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Desde comidas caseras hasta eventos completos. En La Gracia by Marcela's Bakery 
              transformamos cada ocasión en una experiencia culinaria memorable.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection('catalogo')}
                className="bg-gradient-to-r from-[#D97548] to-[#E8A87C] text-white px-8 py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 group"
              >
                <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Explorar Catálogo</span>
              </button>
              
              <a
                href="https://wa.me/50684152888"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#D97548] text-[#D97548] px-8 py-4 rounded-full hover:bg-[#D97548] hover:text-white transition-all duration-300 flex items-center gap-2 group"
              >
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-[#D97548]">100+</div>
                <div className="text-sm text-gray-600">Eventos realizados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#D97548]">50+</div>
                <div className="text-sm text-gray-600">Productos únicos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#D97548]">5★</div>
                <div className="text-sm text-gray-600">Calificación</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D97548]/20 to-transparent rounded-3xl transform rotate-3"></div>
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1696721497670-d57754966c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBwYXN0cmllc3xlbnwxfHx8fDE3NjY0ODMzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Deliciosos platillos de La Gracia"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}