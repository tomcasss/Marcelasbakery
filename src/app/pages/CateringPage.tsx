import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function CateringPage() {
  const services = [
    {
      title: 'Celebraciones',
      description: 'Fiestas, brindis, eventos sociales y celebraciones especiales',
    },
    {
      title: 'Salas de Eventos',
      description: 'Espacios cómodos para hasta 200 personas con áreas de recreación',
    },
    {
      title: 'Mobiliario',
      description: 'Alquiler de equipos y mobiliario para fiestas',
    },
    {
      title: 'Animación',
      description: 'Maestros de ceremonia, botargas y animación profesional',
    },
    {
      title: 'Decoración',
      description: 'Decoración completa del salón según tus necesidades',
    },
    {
      title: 'Transporte',
      description: 'Servicio de bus para trasladar personal al evento',
    },
    {
      title: 'Actividades',
      description: 'Show de carnaval, toro mecánico, juegos inflables, payasos',
    },
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl text-[#ce733e] text-center mb-6">
            Catering Service
          </h1>
          <p className="text-center text-gray-700 text-lg mb-12 max-w-2xl mx-auto">
            Nuestra amplia experiencia y flexibilidad nos permite atender y ofrecer 
            servicios completos para tus eventos especiales
          </p>

          <div className="mb-16">
            <div className="h-[400px] rounded-lg overflow-hidden border-2 border-[#ce733e] mb-8">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Catering Service"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h2 className="text-2xl text-[#ce733e] mb-8 text-center">
            Nuestros Servicios
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-[#FFF8F0] p-6 rounded-lg border-2 border-[#ce733e]"
              >
                <h3 className="text-lg text-[#ce733e] mb-2">{service.title}</h3>
                <p className="text-gray-700 text-sm">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#ce733e] text-white p-8 rounded-lg text-center">
            <h2 className="text-2xl mb-4">¿Listo para tu evento?</h2>
            <p className="mb-6">
              Solicita tu cotización desde WhatsApp. Los mejores precios del mercado.
            </p>
            <a
              href="https://wa.me/50684152888?text=Hola!%20Me%20gustaría%20solicitar%20una%20cotización%20para%20un%20evento"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#ce733e] px-8 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              Solicitar Cotización por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
