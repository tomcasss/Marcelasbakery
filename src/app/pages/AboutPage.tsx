import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function AboutPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl text-[#ce733e] text-center mb-12">
            Sobre Nosotros
          </h1>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="h-[400px] rounded-lg overflow-hidden border-2 border-[#ce733e]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1657498023828-1e0181449d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjY1MjEwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Marcela - Fundadora"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl text-[#ce733e]">
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

          <div className="bg-[#FFF8F0] p-8 rounded-lg border-2 border-[#ce733e] mb-16">
            <h2 className="text-2xl text-[#ce733e] mb-6 text-center">
              Nuestros Valores
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#ce733e] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">❤️</span>
                </div>
                <h3 className="text-lg text-[#ce733e] mb-2">Hecho con Amor</h3>
                <p className="text-gray-700 text-sm">
                  Cada platillo se prepara con dedicación y cariño
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#ce733e] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">✨</span>
                </div>
                <h3 className="text-lg text-[#ce733e] mb-2">Ingredientes Frescos</h3>
                <p className="text-gray-700 text-sm">
                  Usamos solo ingredientes de la mejor calidad
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#ce733e] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🏠</span>
                </div>
                <h3 className="text-lg text-[#ce733e] mb-2">Sabor Casero</h3>
                <p className="text-gray-700 text-sm">
                  Recetas tradicionales como las de casa
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl text-[#ce733e] mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6">
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
