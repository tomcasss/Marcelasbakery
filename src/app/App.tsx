import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Cart, CartItem } from './components/Cart';
import { CheckoutProvider } from './context/CheckoutContext';
import { Product } from './components/Catalog';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CatalogPage } from './pages/CatalogPage';
import { CateringPage } from './pages/CateringPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setCheckoutOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
    setCartItems([]);
  };

  return (
    <CheckoutProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
        <Header cartItemsCount={totalItems} onCartClick={() => setCartOpen(true)} />
        <main className="flex-1 overflow-x-hidden">
          {checkoutOpen ? (
            <CheckoutPage 
              items={cartItems} 
              total={total} 
              onClose={handleCloseCheckout}
            />
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sobre-nosotros" element={<AboutPage />} />
              <Route path="/catalogo" element={<CatalogPage onAddToCart={handleAddToCart} />} />
              <Route path="/catering" element={<CateringPage />} />
              <Route path="/contacto" element={<ContactPage />} />
            </Routes>
          )}
        </main>
        <Footer />
        <Cart
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />
      </div>
      </Router>
    </CheckoutProvider>
  );
}
