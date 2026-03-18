import { Mail, Phone, MapPin, Instagram, Facebook, Clock, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Crear mensaje para WhatsApp
    const message = `Hola! Me comunico desde la página web:\n\nNombre: ${formData.name}\nEmail: ${formData.email}\nTeléfono: ${formData.phone}\n\nMensaje: ${formData.message}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/50684152888?text=${encodedMessage}`, '_blank');
    
    // Limpiar formulario
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contacto" className="py-24 bg-gradient-to-br from-[#FFF8F0] to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#D97548] uppercase tracking-wider text-sm font-semibold">Hablemos</span>
          <h2 className="text-4xl lg:text-5xl font-serif text-gray-900 mt-3 mb-6">Contacto</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            ¿Tienes alguna duda? Dejanos tu mensaje
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-serif text-gray-900 mb-6">Información de Contacto</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D97548] to-[#E8A87C] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Teléfono / WhatsApp</p>
                    <a href="tel:+50684152888" className="text-lg text-[#D97548] hover:underline font-semibold">
                      (506) 8415-2888
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D97548] to-[#E8A87C] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <a href="mailto:marcelasbakery@gmail.com" className="text-lg text-[#D97548] hover:underline font-semibold">
                      marcelasbakery@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D97548] to-[#E8A87C] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Ubicación</p>
                    <p className="text-lg text-gray-900">
                      Frente a las canchas de futsal del Colegio Madre del Divino Pastor<br />
                      San José, Guadalupe, Costa Rica
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-[#D97548]/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#D97548]/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#D97548]" />
                </div>
                <h3 className="text-xl font-serif text-gray-900">Horario de Atención</h3>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Lunes - Viernes:</span>
                  <span className="font-semibold text-gray-900">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado:</span>
                  <span className="font-semibold text-gray-900">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo:</span>
                  <span className="font-semibold text-gray-900">Cerrado</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-serif text-gray-900 mb-4">Síguenos en Redes</h3>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-gradient-to-br from-[#D97548] to-[#E8A87C] rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md group"
                >
                  <Instagram className="w-7 h-7 text-white" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-gradient-to-br from-[#D97548] to-[#E8A87C] rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md group"
                >
                  <Facebook className="w-7 h-7 text-white" />
                </a>
                <a
                  href="https://wa.me/50684152888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md group"
                >
                  <MessageCircle className="w-7 h-7 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#D97548]/10">
            <h3 className="text-2xl font-serif text-gray-900 mb-6">Envíanos un Mensaje</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97548] focus:outline-none focus:ring-2 focus:ring-[#D97548]/20 transition-all"
                  required
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97548] focus:outline-none focus:ring-2 focus:ring-[#D97548]/20 transition-all"
                  required
                  placeholder="tu@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2 font-medium">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97548] focus:outline-none focus:ring-2 focus:ring-[#D97548]/20 transition-all"
                  placeholder="8415-2888"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2 font-medium">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97548] focus:outline-none focus:ring-2 focus:ring-[#D97548]/20 transition-all resize-none"
                  required
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D97548] to-[#E8A87C] text-white py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group"
              >
                <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Enviar por WhatsApp</span>
              </button>
              <p className="text-xs text-center text-gray-500">
                Al enviar, serás redirigido a WhatsApp para completar el mensaje
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}