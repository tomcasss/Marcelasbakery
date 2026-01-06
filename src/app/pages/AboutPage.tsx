import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function AboutPage() {
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
                src="https://images.unsplash.com/photo-1657498023828-1e0181449d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjY1MjEwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
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
        </div>
      </div>
    </div>
  );
}
