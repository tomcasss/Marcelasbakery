import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ImageCarousel } from '../components/ImageCarousel';
import { Link } from 'react-router-dom';
import { Heart, Clock, ShieldCheck, Users, Phone, Download, Calendar, CreditCard } from 'lucide-react';

// Imágenes para el carrusel
const carouselImages = [
  {
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop',
    alt: 'Deliciosos platillos de comida casera',
    title: 'Sabor Auténtico en Cada Bocado'
  },
  {
    url: 'https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?w=1200&h=800&fit=crop',
    alt: 'Catering para eventos especiales',
    title: 'Catering para tus Eventos Especiales'
  },
  {
    url: 'https://images.unsplash.com/photo-1558859142-c3edb27e2c25?w=1200&h=800&fit=crop',
    alt: 'Postres y rompopes artesanales',
    title: 'Postres Artesanales Irresistibles'
  },
  {
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop',
    alt: 'Comida preparada con amor',
    title: 'Preparado con Amor y Dedicación'
  },
  {
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop',
    alt: 'Ingredientes frescos y de calidad',
    title: 'Solo los Mejores Ingredientes'
  }
];

export function HomePage() {
  return (
    <div>
      {/* Hero Section Mejorado */}
      <section className="relative bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF4E8] py-20 overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#cd733d]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#369db1]/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                Restaurant & Catering Service
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-6 leading-tight">
              Bienvenidos a <span className="text-[#cd733d]">La Gracia</span>
              <span className="block text-3xl md:text-4xl mt-2 text-gray-600">by Marcela's Bakery</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed">
              Comida casera preparada con <span className="text-[#cd733d] font-semibold">amor</span> para tus momentos especiales
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link
                to="/catalogo"
                className="bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white px-8 py-4 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 font-semibold"
              >
                <Download className="w-5 h-5" />
                Descargar Catálogo
              </Link>
              <a
                href="https://wa.me/50684152888"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#cd733d] border-2 border-[#cd733d] px-8 py-4 rounded-lg hover:bg-[#cd733d] hover:text-white transition-all duration-300 flex items-center gap-2 font-semibold shadow-md"
              >
                <Phone className="w-5 h-5" />
                WhatsApp: 8415-2888
              </a>
            </div>
            
            {/* Stats rápidas */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-md">
                <div className="text-3xl font-bold text-[#cd733d]">100+</div>
                <div className="text-sm text-gray-600">Eventos realizados</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-md">
                <div className="text-3xl font-bold text-[#369db1]">50+</div>
                <div className="text-sm text-gray-600">Productos únicos</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-md">
                <div className="text-3xl font-bold text-[#dd667d]">5★</div>
                <div className="text-sm text-gray-600">Calificación</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel de Imágenes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">
              Descubre Nuestra <span className="text-[#cd733d]">Variedad</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cada imagen cuenta una historia de sabor y dedicación
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <ImageCarousel images={carouselImages} />
          </div>
        </div>
      </section>

      {/* Valores - Lo que nos hace especiales */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nos diferenciamos por nuestro compromiso con la calidad y el sabor casero auténtico
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#cd733d] to-[#e89360] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hecho con Amor</h3>
              <p className="text-gray-600 text-sm">
                Cada platillo preparado con dedicación y cariño, como en casa
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#369db1] to-[#387dae] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ingredientes Frescos</h3>
              <p className="text-gray-600 text-sm">
                Solo usamos ingredientes de la mejor calidad y frescura
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#6d63ab] to-[#8b7fc7] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Siempre a Tiempo</h3>
              <p className="text-gray-600 text-sm">
                Puntualidad garantizada en entregas y eventos
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#dd667d] to-[#e88b9f] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trato Familiar</h3>
              <p className="text-gray-600 text-sm">
                Atención personalizada que te hace sentir como en familia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-br from-[#FFF8F0] to-[#FFF4E8]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">
              Nuestras Categorías
            </h2>
            <p className="text-gray-600">
              Descubre la variedad de opciones que tenemos para ti
            </p>
          </div>
          
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
                className="group bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#cd733d]"
              >
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <ImageWithFallback
                    src={category.img}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 text-center bg-white group-hover:bg-gradient-to-r group-hover:from-[#cd733d] group-hover:to-[#e89360] transition-all duration-300">
                  <h3 className="text-lg font-semibold text-[#cd733d] group-hover:text-white transition-colors">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Información de Pedidos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">
              Cómo hacer tu pedido
            </h2>
            <p className="text-gray-600">
              Proceso simple y seguro para disfrutar nuestros productos
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Horarios */}
            <div className="bg-gradient-to-br from-[#FFF8F0] to-white rounded-xl p-6 border-2 border-[#cd733d]/20 hover:border-[#cd733d] transition-all shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-[#cd733d] to-[#e89360] rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Horarios de Pedido</h3>
              <div className="space-y-2 text-gray-700">
                <p className="font-semibold text-[#cd733d]">Retiro Martes:</p>
                <p className="text-sm">Pedidos hasta sábado 3:00 PM</p>
                <p className="font-semibold text-[#cd733d] mt-3">Retiro Viernes:</p>
                <p className="text-sm">Pedidos hasta miércoles 3:00 PM</p>
                <p className="text-xs text-gray-500 mt-3 italic">
                  *Horario de retiro: Martes y Viernes de 9:00 AM a 3:00 PM
                </p>
              </div>
            </div>

            {/* Métodos de Pago */}
            <div className="bg-gradient-to-br from-[#FFF8F0] to-white rounded-xl p-6 border-2 border-[#369db1]/20 hover:border-[#369db1] transition-all shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-[#369db1] to-[#387dae] rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Métodos de Pago</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#369db1] rounded-full"></div>
                  <span className="text-sm">SINPE Móvil</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#369db1] rounded-full"></div>
                  <span className="text-sm">Transferencia bancaria</span>
                </div>
                <p className="text-sm font-semibold text-[#369db1] mt-4">
                  50% adelanto - 50% contra retiro
                </p>
              </div>
            </div>

            {/* Envío */}
            <div className="bg-gradient-to-br from-[#FFF8F0] to-white rounded-xl p-6 border-2 border-[#6d63ab]/20 hover:border-[#6d63ab] transition-all shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-[#6d63ab] to-[#8b7fc7] rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Envío Express</h3>
              <div className="space-y-3 text-gray-700">
                <p className="text-sm">
                  Servicio de entrega disponible con costo adicional según zona
                </p>
                <p className="text-sm">
                  Consulta disponibilidad por WhatsApp
                </p>
                <a
                  href="https://wa.me/50684152888"
                  className="inline-block mt-3 text-[#6d63ab] font-semibold text-sm hover:underline"
                >
                  Preguntar por envío →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-gradient-to-br from-[#cd733d] to-[#b35f2f] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-white/90">
              La satisfacción de nuestros clientes es nuestro mejor logro
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-yellow-300">★</span>
                ))}
              </div>
              <p className="text-white/90 mb-4 italic">
                "La comida es deliciosa y el servicio excelente. Se nota el amor con el que preparan cada platillo. Totalmente recomendado para eventos."
              </p>
              <p className="font-semibold">María González</p>
              <p className="text-sm text-white/70">Cliente frecuente</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-yellow-300">★</span>
                ))}
              </div>
              <p className="text-white/90 mb-4 italic">
                "Contraté el servicio de catering para la fiesta de mi hijo y todo estuvo perfecto. La comida llegó a tiempo y caliente. ¡Excelente!"
              </p>
              <p className="font-semibold">Carlos Rodríguez</p>
              <p className="text-sm text-white/70">Evento familiar</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-yellow-300">★</span>
                ))}
              </div>
              <p className="text-white/90 mb-4 italic">
                "Los postres son increíbles, especialmente el rompope. La calidad y sabor casero hacen la diferencia. ¡Volveré por más!"
              </p>
              <p className="font-semibold">Ana Jiménez</p>
              <p className="text-sm text-white/70">Amante de los postres</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-[#FFF8F0] to-[#FFF4E8] rounded-2xl p-12 border-2 border-[#cd733d]/20">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">
              ¿Necesitas catering para tu evento?
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Ofrecemos servicios completos: celebraciones, salas de eventos, mobiliario, 
              animación, decoración y menús personalizados para hacer tu celebración inolvidable
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/catering"
                className="bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white px-8 py-4 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
              >
                Ver Servicios de Catering
              </Link>
              <Link
                to="/catalogo"
                className="bg-white text-[#cd733d] border-2 border-[#cd733d] px-8 py-4 rounded-lg hover:bg-[#cd733d] hover:text-white transition-all duration-300 font-semibold"
              >
                Explorar Catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
