import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hola! Me comunico desde la página web:\n\nNombre: ${formData.name}\nEmail: ${formData.email}\nTeléfono: ${formData.phone}\n\nMensaje: ${formData.message}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/50684152888?text=${encodedMessage}`, '_blank');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl text-[#ce733e] text-center mb-12">
            Contacto
          </h1>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-2xl text-[#ce733e] mb-6">
                Información de Contacto
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#ce733e] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Teléfono / WhatsApp</p>
                    <a href="tel:+50684152888" className="text-lg text-[#ce733e] hover:underline">
                      (506) 8415-2888
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#ce733e] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <a href="mailto:marcelasbakery@gmail.com" className="text-lg text-[#ce733e] hover:underline">
                      marcelasbakery@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#ce733e] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ubicación</p>
                    <p className="text-gray-900">
                      Frente a las canchas de futsal del<br />
                      Colegio Madre del Divino Pastor<br />
                      San José, Guadalupe, Costa Rica
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFF8F0] p-6 rounded-lg border-2 border-[#ce733e]">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-[#ce733e]" />
                  <h3 className="text-lg text-[#ce733e]">Horario de Atención</h3>
                </div>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes:</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado:</span>
                    <span>9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo:</span>
                    <span>Cerrado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#FFF8F0] p-8 rounded-lg border-2 border-[#ce733e]">
              <h2 className="text-2xl text-[#ce733e] mb-6">
                Envíanos un Mensaje
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border-2 border-[#ce733e] focus:outline-none focus:border-[#b35f2f]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border-2 border-[#ce733e] focus:outline-none focus:border-[#b35f2f]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border-2 border-[#ce733e] focus:outline-none focus:border-[#b35f2f]"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-md border-2 border-[#ce733e] focus:outline-none focus:border-[#b35f2f] resize-none"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#ce733e] text-white py-3 rounded-md hover:bg-[#b35f2f] transition-colors"
                >
                  Enviar por WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
