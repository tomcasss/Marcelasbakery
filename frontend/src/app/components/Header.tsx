import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

export function Header({ cartItemsCount, onCartClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/98 backdrop-blur-md shadow-md border-b border-[#cd733d]/10 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex flex-col group">
            <span className="text-3xl font-serif text-gray-900 group-hover:text-[#cd733d] transition-colors font-bold tracking-tight">La Gracia</span>
            <span className="text-xs text-[#cd733d] font-semibold tracking-wide">by Marcela's Bakery</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`${isActive('/') ? 'text-[#cd733d] font-semibold' : 'text-gray-700'} hover:text-[#cd733d] transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#cd733d] after:transition-all`}
            >
              Inicio
            </Link>
            <Link
              to="/sobre-nosotros"
              className={`${isActive('/sobre-nosotros') ? 'text-[#cd733d] font-semibold' : 'text-gray-700'} hover:text-[#cd733d] transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#cd733d] after:transition-all`}
            >
              Sobre Nosotros
            </Link>
            <Link
              to="/catalogo"
              className={`${isActive('/catalogo') ? 'text-[#cd733d] font-semibold' : 'text-gray-700'} hover:text-[#cd733d] transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#cd733d] after:transition-all`}
            >
              Catálogo
            </Link>
            <Link
              to="/catering"
              className={`${isActive('/catering') ? 'text-[#cd733d] font-semibold' : 'text-gray-700'} hover:text-[#cd733d] transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#cd733d] after:transition-all`}
            >
              Catering Service
            </Link>
            <Link
              to="/contacto"
              className={`${isActive('/contacto') ? 'text-[#cd733d] font-semibold' : 'text-gray-700'} hover:text-[#cd733d] transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#cd733d] after:transition-all`}
            >
              Contacto
            </Link>
            <button
              onClick={onCartClick}
              className="relative bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white px-5 py-2.5 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#dd667d] text-white text-xs w-7 h-7 rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce border-2 border-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={onCartClick}
              className="relative bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white p-2 rounded-lg hover:shadow-lg transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#dd667d] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4 border-t pt-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`${isActive('/') ? 'text-[#cd733d] font-semibold' : 'text-gray-700'} hover:text-[#cd733d] transition-colors`}
            >
              Inicio
            </Link>
            <Link
              to="/sobre-nosotros"
              onClick={() => setMobileMenuOpen(false)}
              className={`${isActive('/sobre-nosotros') ? 'text-[#cd733d] font-semibold' : 'text-gray-700'} hover:text-[#cd733d] transition-colors`}
            >
              Sobre Nosotros
            </Link>
            <Link
              to="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className={`${isActive('/catalogo') ? 'text-[#cd733d] font-semibold' : 'text-gray-700'} hover:text-[#cd733d] transition-colors`}
            >
              Catálogo
            </Link>
            <Link
              to="/catering"
              onClick={() => setMobileMenuOpen(false)}
              className={`${isActive('/catering') ? 'text-[#cd733d] font-semibold' : 'text-gray-700'} hover:text-[#cd733d] transition-colors`}
            >
              Catering Service
            </Link>
            <Link
              to="/contacto"
              onClick={() => setMobileMenuOpen(false)}
              className={`${isActive('/contacto') ? 'text-[#cd733d] font-semibold' : 'text-gray-700'} hover:text-[#cd733d] transition-colors`}
            >
              Contacto
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
