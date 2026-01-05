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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex flex-col">
            <span className="text-2xl text-gray-900">La Gracia</span>
            <span className="text-xs text-[#ce733e]">by Marcela's Bakery</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`${isActive('/') ? 'text-[#ce733e]' : 'text-gray-700'} hover:text-[#ce733e] transition-colors`}
            >
              Inicio
            </Link>
            <Link
              to="/sobre-nosotros"
              className={`${isActive('/sobre-nosotros') ? 'text-[#ce733e]' : 'text-gray-700'} hover:text-[#ce733e] transition-colors`}
            >
              Sobre Nosotros
            </Link>
            <Link
              to="/catalogo"
              className={`${isActive('/catalogo') ? 'text-[#ce733e]' : 'text-gray-700'} hover:text-[#ce733e] transition-colors`}
            >
              Catálogo
            </Link>
            <Link
              to="/catering"
              className={`${isActive('/catering') ? 'text-[#ce733e]' : 'text-gray-700'} hover:text-[#ce733e] transition-colors`}
            >
              Catering Service
            </Link>
            <Link
              to="/contacto"
              className={`${isActive('/contacto') ? 'text-[#ce733e]' : 'text-gray-700'} hover:text-[#ce733e] transition-colors`}
            >
              Contacto
            </Link>
            <button
              onClick={onCartClick}
              className="relative bg-[#ce733e] text-white px-4 py-2 rounded-md hover:bg-[#b35f2f] transition-colors flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={onCartClick}
              className="relative bg-[#ce733e] text-white p-2 rounded-md"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
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
              className={`${isActive('/') ? 'text-[#ce733e]' : 'text-gray-700'} hover:text-[#ce733e] transition-colors`}
            >
              Inicio
            </Link>
            <Link
              to="/sobre-nosotros"
              onClick={() => setMobileMenuOpen(false)}
              className={`${isActive('/sobre-nosotros') ? 'text-[#ce733e]' : 'text-gray-700'} hover:text-[#ce733e] transition-colors`}
            >
              Sobre Nosotros
            </Link>
            <Link
              to="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className={`${isActive('/catalogo') ? 'text-[#ce733e]' : 'text-gray-700'} hover:text-[#ce733e] transition-colors`}
            >
              Catálogo
            </Link>
            <Link
              to="/catering"
              onClick={() => setMobileMenuOpen(false)}
              className={`${isActive('/catering') ? 'text-[#ce733e]' : 'text-gray-700'} hover:text-[#ce733e] transition-colors`}
            >
              Catering Service
            </Link>
            <Link
              to="/contacto"
              onClick={() => setMobileMenuOpen(false)}
              className={`${isActive('/contacto') ? 'text-[#ce733e]' : 'text-gray-700'} hover:text-[#ce733e] transition-colors`}
            >
              Contacto
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
