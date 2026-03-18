import { Heart, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#cd733d] via-[#b35f2f] to-[#9a4d26] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <h3 className="text-3xl font-serif mb-2">La Gracia</h3>
              <p className="text-sm text-white/90 font-medium">Restaurant & Catering</p>
              <p className="text-xs text-white/70 mt-1">By Marcela's Bakery</p>
            </div>
            <p className="text-sm text-white/80 leading-relaxed mb-6">
              Sabor casero para tus momentos especiales
            </p>
            {/* Redes Sociales */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/lagraciacr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/lagraciacr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/50 rounded-full group-hover:bg-white transition-all"></span>
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/sobre-nosotros" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/50 rounded-full group-hover:bg-white transition-all"></span>
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/50 rounded-full group-hover:bg-white transition-all"></span>
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/catering" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/50 rounded-full group-hover:bg-white transition-all"></span>
                  Catering Service
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/50 rounded-full group-hover:bg-white transition-all"></span>
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-white/90" />
                <div>
                  <p className="text-white/60 text-xs mb-1">Teléfono / WhatsApp</p>
                  <a href="tel:+50684152888" className="hover:text-white transition-colors font-medium">
                    (506) 8415-2888
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-white/90" />
                <div>
                  <p className="text-white/60 text-xs mb-1">Email</p>
                  <a href="mailto:marcelasbakery@gmail.com" className="hover:text-white transition-colors break-all font-medium">
                    marcelasbakery@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-white/90" />
                <div>
                  <p className="text-white/60 text-xs mb-1">Ubicación</p>
                  <span className="leading-relaxed">
                    Frente a las paradas de buses del<br />
                    Colegio Madre del Divino Pastor<br />
                    San José, Guadalupe, Costa Rica
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Horario de Retiro</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <p className="font-semibold text-white mb-1">Martes y Viernes:</p>
                <p className="text-white/70">9:00 AM - 3:00 PM</p>
              </li>
              <li className="pt-3 border-t border-white/10">
                <p className="font-semibold text-white mb-1">Pedidos:</p>
                <p className="text-white/70 text-xs">
                  Retiro Martes: hasta sábado 3:00 PM<br />
                  Retiro Viernes: hasta miércoles 3:00 PM
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="flex items-center justify-center gap-2 text-sm text-white/80">
              Hecho con <Heart className="w-4 h-4 fill-current text-[#dd667d]" /> por Tomás Castro
            </p>
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} La Gracia. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}