import { Calendar, Users, Utensils, Sparkles, PartyPopper, Briefcase, Baby, GraduationCap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const services = [
  {
    icon: PartyPopper,
    title: 'Celebraciones',
    description: 'Fiestas, brindis, eventos sociales y celebraciones especiales. Creamos el ambiente perfecto.',
  },
  {
    icon: Users,
    title: 'Salas de Eventos',
    description: 'Tenemos a tu disposición espacios y cómodas salas para tus eventos, fiestas hasta para 200 personas, ubicadas en distintas áreas de recreación y áreas infantiles.',
  },
  {
    icon: Utensils,
    title: 'Mobiliario',
    description: 'La ofrecemos alquiler de equipos y mobiliario para fiestas.',
  },
  {
    icon: Sparkles,
    title: 'Animación',
    description: 'Maestros de Ceremonia, botargas y/o animación de tu evento por profesionales en este campo.',
  },
  {
    icon: Sparkles,
    title: 'Decoración',
    description: 'Decoración total de las salones de acuerdo a cada necesidad.',
  },
  {
    icon: Users,
    title: 'Transporte',
    description: 'Servicio de bus para trasladar a tu personal al lugar de la actividad.',
  },
  {
    icon: Users,
    title: 'Actividades',
    description: 'Show de carnaval, toro mecánico, juegos inflables, payasos, etc.',
  },
];

export function Catering() {
  return (
    <section id="catering" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D97548]/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#D97548] uppercase tracking-wider text-sm font-semibold">Servicios Completos</span>
          <h2 className="text-4xl lg:text-5xl font-serif text-gray-900 mt-3 mb-6">Catering Service</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Nuestra amplia experiencia y flexibilidad nos permite atender y ofrecer, entre otros servicios, los siguientes:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8 order-2 md:order-1">
            <div className="bg-gradient-to-br from-[#FFF8F0] to-white p-8 rounded-3xl border border-[#D97548]/10">
              <h3 className="text-2xl font-serif text-gray-900 mb-6">¿Por qué elegirnos?</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D97548]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-[#D97548]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Planificación Personalizada</h4>
                    <p className="text-gray-600">Trabajamos contigo para crear el evento perfecto adaptado a tus necesidades</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D97548]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-[#D97548]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Cualquier Tamaño</h4>
                    <p className="text-gray-600">Desde eventos íntimos hasta celebraciones para 200+ personas</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D97548]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Utensils className="w-6 h-6 text-[#D97548]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Menús Variados</h4>
                    <p className="text-gray-600">Opciones dulces y saladas para todos los gustos y preferencias</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative order-1 md:order-2">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#D97548]/10 to-[#F4D19B]/10 rounded-3xl"></div>
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Servicio de catering de La Gracia"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-gray-900 text-center mb-12">Nuestros Servicios</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-white to-[#FFF8F0] p-6 rounded-2xl border border-[#D97548]/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D97548] to-[#E8A87C] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-serif text-gray-900 mb-2">{service.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-[#D97548] via-[#E8A87C] to-[#D97548] rounded-3xl p-12 text-white text-center shadow-2xl">
          <h3 className="text-3xl font-serif mb-4">¿Listo para tu evento especial?</h3>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
            Solicita tu cotización desde el WhatsApp. Los mejores precios del mercado.
          </p>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <PartyPopper className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Bodas & Celebraciones</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Briefcase className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Eventos Corporativos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Baby className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Baby Showers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <GraduationCap className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Graduaciones</p>
            </div>
          </div>
          
          <a
            href="https://wa.me/50684152888?text=Hola!%20Me%20gustaría%20solicitar%20una%20cotización%20para%20un%20evento"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[#D97548] px-10 py-4 rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl font-semibold"
          >
            Solicitar Cotización por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}