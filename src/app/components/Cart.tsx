import { X, Minus, Plus, ShoppingBag, MessageCircle } from 'lucide-react';
import { Product } from './Catalog';

export interface CartItem extends Product {
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleWhatsAppOrder = () => {
    let message = '¡Hola! Me gustaría ordenar lo siguiente:\n\n';
    
    items.forEach((item) => {
      message += `• ${item.name} x${item.quantity} - ₡${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    message += `\nTotal: ₡${total.toLocaleString()}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/50684152888?text=${encodedMessage}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b bg-[#ce733e] text-white">
          <div>
            <h2 className="text-2xl">Tu Carrito</h2>
            <p className="text-sm text-white/90">{items.length} {items.length === 1 ? 'producto' : 'productos'}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-md transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-500">Agrega productos deliciosos para continuar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-4 border-2 border-[#ce733e]"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-[#ce733e] truncate pr-2">{item.name}</h3>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-[#ce733e] mb-3">
                        ₡{item.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="bg-gray-100 text-gray-700 w-8 h-8 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-gray-900 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-100 text-gray-700 w-8 h-8 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-500 ml-auto">
                          ₡{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t bg-white p-6 space-y-4 shadow-lg">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-gray-600">
                <span>Subtotal</span>
                <span>₡{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-lg text-gray-900">Total</span>
                <span className="text-2xl text-[#ce733e]">
                  ₡{total.toLocaleString()}
                </span>
              </div>
            </div>
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#ce733e] text-white py-4 rounded-md hover:bg-[#b35f2f] transition-colors"
            >
              Ordenar por WhatsApp
            </button>
            <p className="text-xs text-center text-gray-500">
              Serás redirigido a WhatsApp para completar tu pedido
            </p>
          </div>
        )}
      </div>
    </div>
  );
}