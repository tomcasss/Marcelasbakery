import { Heart, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#cd733d] to-[#b35f2f] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <h3 className="text-2xl mb-2">LaGracia</h3>
              <p className="text-sm text-white/80">Restaurant & Catering</p>
              <p className="text-xs text-white/70 mt-1">By Marcela's Bakery</p>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Sabor casero para tus momentos especiales
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/sobre-nosotros" className="hover:text-white transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="hover:text-white transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/catering" className="hover:text-white transition-colors">
                  Catering Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="tel:+50684152888" className="hover:text-white transition-colors">
                  (506) 8415-2888
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:marcelasbakery@gmail.com" className="hover:text-white transition-colors break-all">
                  marcelasbakery@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  San José, Guadalupe<br />
                  Costa Rica
                </span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="mb-4">Horario</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Lunes - Viernes:<br/>8:00 AM - 6:00 PM</li>
              <li>Sábado:<br/>9:00 AM - 4:00 PM</li>
              <li>Domingo:<br/>Cerrado</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="flex items-center justify-center gap-2 text-sm text-white/80 mb-2">
            Hecho con <Heart className="w-4 h-4 fill-current" /> por La Gracia by Marcela's Bakery
          </p>
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} La Gracia. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}