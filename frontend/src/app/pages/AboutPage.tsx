import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useSiteImages } from '../context/SiteConfigContext';

export function AboutPage() {
  const siteImages = useSiteImages();
  return (
    <div className="py-16 bg-gradient-to-br from-[#FFF8F0] to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-serif text-gray-900 text-center mb-4">
            Sobre <span className="text-[#cd733d]">Nosotros</span>
          </h1>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Conoce la historia detrás de cada platillo
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="h-[400px] rounded-2xl overflow-hidden border-2 border-[#cd733d] shadow-xl">
              <ImageWithFallback
                src={siteImages.about_image}
                alt="Marcela - Fundadora"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-serif text-[#cd733d]">
                Nuestra Historia
              </h2>
              <p className="text-gray-700 leading-relaxed">
                La Gracia by Marcela's Bakery nació del sueño de Marcela de compartir 
                el sabor de la comida casera con más familias. Con años de experiencia 
                en la cocina y una pasión por hacer feliz a la gente a través de la comida, 
                Marcela creó un espacio donde cada platillo se prepara con el mismo cuidado 
                y amor que en casa.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Ubicados en San José, Guadalupe, frente a las canchas de futsal del 
                Colegio Madre del Divino Pastor, servimos a nuestra comunidad con comida 
                preparada diariamente y servicios completos de catering para eventos 
                especiales.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-[#FFF8F0] p-8 rounded-2xl border-2 border-[#cd733d]/20 mb-16 shadow-lg">
            <h2 className="text-3xl font-serif text-[#cd733d] mb-8 text-center">
              Nuestros Valores
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#cd733d] to-[#e89360] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <span className="text-2xl text-white">❤️</span>
                </div>
                <h3 className="text-lg font-semibold text-[#cd733d] mb-2">Hecho con Amor</h3>
                <p className="text-gray-700 text-sm">
                  Cada platillo se prepara con dedicación y cariño
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#369db1] to-[#387dae] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <span className="text-2xl text-white">✨</span>
                </div>
                <h3 className="text-lg font-semibold text-[#369db1] mb-2">Ingredientes Frescos</h3>
                <p className="text-gray-700 text-sm">
                  Usamos solo ingredientes de la mejor calidad
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#6d63ab] to-[#8b7fc7] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <span className="text-2xl text-white">🏠</span>
                </div>
                <h3 className="text-lg font-semibold text-[#6d63ab] mb-2">Sabor Casero</h3>
                <p className="text-gray-700 text-sm">
                  Recetas tradicionales como las de casa
                </p>
              </div>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white rounded-2xl p-12">
            <h2 className="text-3xl font-serif mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-white/90 leading-relaxed max-w-2xl mx-auto mb-6 text-lg">
              Somos más que un servicio de comida. Somos una familia que se preocupa 
              por cada detalle, desde la selección de ingredientes hasta la presentación 
              final. Nuestro objetivo es que cada bocado te haga sentir en casa.
            </p>
          </div>

          {/* Sección Cómo Llegar */}
          <div className="mt-16">
            <h2 className="text-3xl font-serif text-gray-900 text-center mb-2">
              ¿Cómo <span className="text-[#cd733d]">llegar?</span>
            </h2>
            <p className="text-center text-gray-500 mb-8 text-sm">
              Frente a las paradas de buses del Colegio Madre del Divino Pastor · Guadalupe, San José
            </p>

            {/* Mapa embebido */}
            <div className="rounded-2xl overflow-hidden border-2 border-[#cd733d]/20 shadow-lg mb-5" style={{ height: 360 }}>
              <iframe
                title="Ubicación La Gracia"
                src="https://maps.google.com/maps?q=9.9557899,-84.0414168&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Botones abrir en app */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=9.9557899,-84.0414168&destination_place_id=ChIJk6lDaVDlqI8RJqkWGfHjo5s"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-white border-2 border-[#cd733d] text-[#cd733d] py-3 rounded-xl font-semibold hover:bg-[#cd733d] hover:text-white transition-all shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Abrir en Google Maps
              </a>
              <a
                href="https://waze.com/ul?ll=9.9557899,-84.0414168&navigate=yes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-white border-2 border-[#5bc8f5] text-[#07adef] py-3 rounded-xl font-semibold hover:bg-[#07adef] hover:text-white transition-all shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.54 6.63C19.08 4.05 16.39 2.27 13.27 2c-4.47-.36-8.38 2.99-8.78 7.46-.17 1.88.3 3.67 1.27 5.18l.07.12-1.07 3.76 3.87-1.01.11.06c1.35.78 2.9 1.22 4.53 1.22h.04c4.59 0 8.32-3.65 8.36-8.24.02-1.85-.55-3.6-1.63-4.92l-.5-.98zM16.5 14.6c-.27.76-1.58 1.45-2.21 1.54-.57.09-1.29.12-2.08-.14-.48-.16-1.09-.37-1.88-.72-3.31-1.44-5.47-4.77-5.64-4.99-.17-.23-1.35-1.8-1.35-3.43s.86-2.43 1.17-2.76c.3-.33.66-.41.88-.41.22 0 .44 0 .63.01.2.01.48-.08.75.57.27.65.94 2.29 1.02 2.46.08.17.13.36.03.58-.1.22-.15.35-.3.54-.15.19-.32.43-.45.58-.15.17-.3.36-.13.7.17.33.75 1.25 1.61 2.02 1.11 1 2.04 1.31 2.36 1.46.33.14.52.12.71-.07.19-.19.82-.96 1.04-1.29.22-.33.43-.27.73-.16.3.1 1.88.89 2.2 1.05.33.16.55.24.63.38.08.13.08.75-.19 1.51z"/>
                </svg>
                Abrir en Waze
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
