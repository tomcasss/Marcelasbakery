import { Heart, Award, Users, ChefHat } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  return (
    <section id="sobre-nosotros" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#D97548] uppercase tracking-wider text-sm font-semibold">Nuestra Historia</span>
          <h2 className="text-4xl lg:text-5xl font-serif text-gray-900 mt-3 mb-6">Sobre Nosotros</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Con años de experiencia y pasión por la gastronomía, creamos momentos inolvidables
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div className="relative order-2 md:order-1">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#D97548]/10 to-[#F4D19B]/10 rounded-3xl"></div>
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1657498023828-1e0181449d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjY1MjEwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Marcela - Fundadora de La Gracia Bakery"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="space-y-6 order-1 md:order-2">
            <div className="inline-flex items-center gap-2 bg-[#FFF8F0] px-4 py-2 rounded-full">
              <ChefHat className="w-5 h-5 text-[#D97548]" />
              <span className="text-[#D97548] font-medium">By Marcela's Bakery</span>
            </div>
            
            <h3 className="text-3xl font-serif text-gray-900">
              Pasión por crear experiencias únicas
            </h3>
            
            <p className="text-gray-600 leading-relaxed">
              La Gracia by Marcela's Bakery nació del sueño de Marcela de compartir su amor 
              por la cocina y hacer que cada celebración sea especial. Con recetas familiares 
              y técnicas profesionales, hemos creado un espacio donde la tradición se encuentra 
              con la innovación.
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              Desde nuestro inicio en San José, Guadalupe, nos hemos dedicado a ofrecer no solo 
              alimentos de la más alta calidad, sino experiencias completas que hacen que cada 
              evento sea memorable. Ya sea una comida casera para disfrutar en familia o un 
              evento corporativo para cientos de personas, ponemos el mismo amor y dedicación 
              en cada detalle.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="bg-[#FFF8F0] p-4 rounded-xl">
                <div className="text-2xl font-bold text-[#D97548] mb-1">15+</div>
                <div className="text-sm text-gray-600">Años de experiencia</div>
              </div>
              <div className="bg-[#FFF8F0] p-4 rounded-xl">
                <div className="text-2xl font-bold text-[#D97548] mb-1">500+</div>
                <div className="text-sm text-gray-600">Clientes felices</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-gradient-to-br from-[#FFF8F0] to-white p-8 rounded-2xl border border-[#D97548]/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D97548] to-[#E8A87C] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-serif text-gray-900 mb-3 text-center">Hecho con Amor</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Cada platillo es elaborado con dedicación y pasión por nuestro equipo de chefs expertos
            </p>
          </div>
          
          <div className="group bg-gradient-to-br from-[#FFF8F0] to-white p-8 rounded-2xl border border-[#D97548]/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D97548] to-[#E8A87C] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-serif text-gray-900 mb-3 text-center">Calidad Premium</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Seleccionamos los mejores ingredientes para garantizar sabores auténticos y frescos
            </p>
          </div>
          
          <div className="group bg-gradient-to-br from-[#FFF8F0] to-white p-8 rounded-2xl border border-[#D97548]/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D97548] to-[#E8A87C] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-serif text-gray-900 mb-3 text-center">Servicio Personalizado</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Adaptamos cada menú y servicio a tus necesidades y preferencias únicas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}