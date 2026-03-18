import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ImageCarousel } from '../components/ImageCarousel';
import { Link } from 'react-router-dom';
import { Heart, Clock, ShieldCheck, Users, Phone, Download, Calendar, CreditCard } from 'lucide-react';
import { useSiteImages } from '../context/SiteConfigContext';

const CAROUSEL_TITLES = [
  'Sabor Auténtico en Cada Bocado',
  'Catering para tus Eventos Especiales',
  'Postres Artesanales Irresistibles',
  'Preparado con Amor y Dedicación',
  'Solo los Mejores Ingredientes',
];

export function HomePage() {
  const foto = (n: number) => `/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_${String(n).padStart(4, '0')}.JPG`;
  const siteImages = useSiteImages();
  const carouselImagesData = [
    siteImages.carousel_image_1,
    siteImages.carousel_image_2,
    siteImages.carousel_image_3,
    siteImages.carousel_image_4,
    siteImages.carousel_image_5,
  ].map((url, i) => ({
    url,
    alt: `La Gracia - foto ${i + 1}`,
    title: CAROUSEL_TITLES[i],
  }));
  return (
    <div>
      {/* Hero Section Mejorado */}
      <section className="relative bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF4E8] py-24 md:py-32 overflow-hidden">
        {/* Elementos decorativos mejorados */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#cd733d]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#369db1]/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e89360]/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge mejorado */}
            <div className="inline-block mb-8 animate-fade-in">
              <span className="bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white px-8 py-3 rounded-full text-sm md:text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Restaurant & Catering Service
              </span>
            </div>
            
            {/* Título principal mejorado */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-gray-900 mb-6 leading-tight tracking-tight">
              <span className="block mb-2">Bienvenidos a</span>
              <span className="text-[#cd733d] relative inline-block">
                La Gracia
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#cd733d] to-[#e89360] rounded-full opacity-50"></span>
              </span>
              <span className="block text-2xl md:text-3xl lg:text-4xl mt-4 text-gray-600 font-light">
                by Marcela's Bakery
              </span>
            </h1>
            
            {/* Tagline destacado del sitio original */}
            <div className="mb-8 animate-fade-in-up">
              <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-[#cd733d] mb-4 font-medium">
                Estamos listos para antojarte
              </p>
              <p className="text-lg md:text-xl text-gray-600 italic">
                Experiencia y amor en la cocina...
              </p>
            </div>
            
            {/* Descripción */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto">
              Comida casera preparada con <span className="text-[#cd733d] font-semibold">amor</span> para tus momentos especiales
            </p>
            
            {/* CTAs mejorados */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link
                to="/catalogo"
                className="group bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white px-10 py-5 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 font-semibold text-lg shadow-lg"
              >
                <Download className="w-6 h-6 group-hover:animate-bounce" />
                Descargar Catálogo
              </Link>
              <a
                href="https://wa.me/50684152888"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white text-[#cd733d] border-3 border-[#cd733d] px-10 py-5 rounded-xl hover:bg-[#cd733d] hover:text-white transition-all duration-300 flex items-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                <Phone className="w-6 h-6 group-hover:animate-pulse" />
                WhatsApp: 8415-2888
              </a>
            </div>
            
            {/* Stats rápidas mejoradas */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-[#cd733d]/10">
                <div className="text-4xl md:text-5xl font-bold text-[#cd733d] mb-2">100+</div>
                <div className="text-sm md:text-base text-gray-600 font-medium">Eventos realizados</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-[#369db1]/10">
                <div className="text-4xl md:text-5xl font-bold text-[#369db1] mb-2">50+</div>
                <div className="text-sm md:text-base text-gray-600 font-medium">Productos únicos</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-[#dd667d]/10">
                <div className="text-4xl md:text-5xl font-bold text-[#dd667d] mb-2">5★</div>
                <div className="text-sm md:text-base text-gray-600 font-medium">Calificación</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel de Imágenes Mejorado */}
      <section className="py-20 bg-gradient-to-b from-white to-[#FFF8F0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
              Descubre Nuestra <span className="text-[#cd733d]">Variedad</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Cada imagen cuenta una historia de sabor y dedicación. 
              <span className="block mt-2 text-[#cd733d] font-medium">
                Experiencia y amor en la cocina...
              </span>
            </p>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-[#cd733d]/10">
              <ImageCarousel images={carouselImagesData} />
            </div>
          </div>
        </div>
      </section>

      {/* Valores - Lo que nos hace especiales Mejorados */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
              ¿Por qué <span className="text-[#cd733d]">elegirnos</span>?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Nos diferenciamos por nuestro compromiso con la calidad y el sabor casero auténtico
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-[#cd733d] to-[#e89360] rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl group-hover:shadow-2xl">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">Hecho con Amor</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Cada platillo preparado con dedicación y cariño, como en casa
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-[#369db1] to-[#387dae] rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl group-hover:shadow-2xl">
                <ShieldCheck className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">Ingredientes Frescos</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Solo usamos ingredientes de la mejor calidad y frescura
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-[#6d63ab] to-[#8b7fc7] rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl group-hover:shadow-2xl">
                <Clock className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">Siempre a Tiempo</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Puntualidad garantizada en entregas y eventos
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-[#dd667d] to-[#e88b9f] rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl group-hover:shadow-2xl">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">Trato Familiar</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Atención personalizada que te hace sentir como en familia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section Mejorada */}
      <section className="py-20 bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF4E8]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
              Nuestras <span className="text-[#cd733d]">Categorías</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre la variedad de opciones que tenemos para ti
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
            {[
              { name: 'Acompañamientos', imgUrl: siteImages.category_acompanamientos },
              { name: 'Platos Fuertes',   imgUrl: siteImages.category_platos_fuertes },
              { name: 'Proteínas',        imgUrl: siteImages.category_proteinas },
              { name: 'Postres',          imgUrl: siteImages.category_postres },
              { name: 'Rompopes',         imgUrl: siteImages.category_rompopes },
            ].map((category) => (
              <Link
                key={category.name}
                to="/catalogo"
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-[#cd733d] transform hover:-translate-y-2"
              >
                <div className="h-56 bg-gray-100 overflow-hidden relative">
                  <ImageWithFallback
                    src={category.imgUrl}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-5 text-center bg-white group-hover:bg-gradient-to-r group-hover:from-[#cd733d] group-hover:to-[#e89360] transition-all duration-300">
                  <h3 className="text-lg font-semibold text-[#cd733d] group-hover:text-white transition-colors">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Información de Pedidos Mejorada */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
              Cómo hacer tu <span className="text-[#cd733d]">pedido</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Proceso simple y seguro para disfrutar nuestros productos
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Horarios */}
            <div className="group bg-gradient-to-br from-[#FFF8F0] to-white rounded-2xl p-8 border-2 border-[#cd733d]/20 hover:border-[#cd733d] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#cd733d] to-[#e89360] rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Compra y Pick Up</h3>
              <div className="space-y-3 text-gray-700">
                <div>
                  <p className="font-semibold text-[#cd733d] mb-1">Retiro Martes:</p>
                  <p className="text-sm">Pedidos hasta sábado 3:00 PM</p>
                </div>
                <div className="pt-2">
                  <p className="font-semibold text-[#cd733d] mb-1">Retiro Viernes:</p>
                  <p className="text-sm">Pedidos hasta miércoles 3:00 PM</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 italic">
                    Horario de retiro: Martes y Viernes de 9:00 AM a 3:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Métodos de Pago */}
            <div className="group bg-gradient-to-br from-[#FFF8F0] to-white rounded-2xl p-8 border-2 border-[#369db1]/20 hover:border-[#369db1] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#369db1] to-[#387dae] rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Condiciones de Compra</h3>
              <div className="space-y-4 text-gray-700">
                <div>
                  <p className="text-sm font-medium mb-2">Aceptamos:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#369db1] rounded-full"></div>
                      <span className="text-sm">SINPE Móvil</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#369db1] rounded-full"></div>
                      <span className="text-sm">Transferencia electrónica</span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm font-semibold text-[#369db1]">
                    50% adelanto - 50% contra retiro
                  </p>
                </div>
              </div>
            </div>

            {/* Envío */}
            <div className="group bg-gradient-to-br from-[#FFF8F0] to-white rounded-2xl p-8 border-2 border-[#6d63ab]/20 hover:border-[#6d63ab] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6d63ab] to-[#8b7fc7] rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Envío Express</h3>
              <div className="space-y-4 text-gray-700">
                <p className="text-sm leading-relaxed">
                  Contamos con servicio express, con un costo adicional según la zona de entrega.
                </p>
                <a
                  href="https://wa.me/50684152888?text=Hola!%20Me%20gustaría%20consultar%20sobre%20el%20servicio%20de%20envío"
                  className="inline-flex items-center gap-2 mt-4 text-[#6d63ab] font-semibold text-sm hover:text-[#8b7fc7] transition-colors group"
                >
                  <span>Consultar por WhatsApp</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios Mejorados */}
      <section className="py-20 bg-gradient-to-br from-[#cd733d] via-[#b35f2f] to-[#9a4d26] text-white relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              La satisfacción de nuestros clientes es nuestro mejor logro
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-white/20 transform hover:-translate-y-1 shadow-xl">
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-yellow-300 text-xl">★</span>
                ))}
              </div>
              <p className="text-white/95 mb-6 italic text-lg leading-relaxed">
                "La comida es deliciosa y el servicio excelente. Se nota el amor con el que preparan cada platillo. Totalmente recomendado para eventos."
              </p>
              <div className="pt-4 border-t border-white/20">
                <p className="font-semibold text-lg">María González</p>
                <p className="text-sm text-white/70">Cliente frecuente</p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-white/20 transform hover:-translate-y-1 shadow-xl">
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-yellow-300 text-xl">★</span>
                ))}
              </div>
              <p className="text-white/95 mb-6 italic text-lg leading-relaxed">
                "Contraté el servicio de catering para la fiesta de mi hijo y todo estuvo perfecto. La comida llegó a tiempo y caliente. ¡Excelente!"
              </p>
              <div className="pt-4 border-t border-white/20">
                <p className="font-semibold text-lg">Carlos Rodríguez</p>
                <p className="text-sm text-white/70">Evento familiar</p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-white/20 transform hover:-translate-y-1 shadow-xl">
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-yellow-300 text-xl">★</span>
                ))}
              </div>
              <p className="text-white/95 mb-6 italic text-lg leading-relaxed">
                "Los postres son increíbles, especialmente el rompope. La calidad y sabor casero hacen la diferencia. ¡Volveré por más!"
              </p>
              <div className="pt-4 border-t border-white/20">
                <p className="font-semibold text-lg">Ana Jiménez</p>
                <p className="text-sm text-white/70">Amante de los postres</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section Mejorada */}
      <section className="py-20 bg-gradient-to-b from-white to-[#FFF8F0]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF4E8] rounded-3xl p-12 md:p-16 border-4 border-[#cd733d]/20 shadow-2xl relative overflow-hidden">
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#cd733d]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#369db1]/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
                ¿Necesitas <span className="text-[#cd733d]">catering</span> para tu evento?
              </h2>
              <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
                Ofrecemos servicios completos: celebraciones, salas de eventos, mobiliario, 
                animación, decoración y menús personalizados para hacer tu celebración inolvidable
              </p>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <Link
                  to="/catering"
                  className="group bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white px-10 py-5 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-lg shadow-lg flex items-center gap-2"
                >
                  <span>Ver Servicios de Catering</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  to="/catalogo"
                  className="group bg-white text-[#cd733d] border-3 border-[#cd733d] px-10 py-5 rounded-xl hover:bg-[#cd733d] hover:text-white transition-all duration-300 font-semibold text-lg shadow-lg"
                >
                  Explorar Catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
