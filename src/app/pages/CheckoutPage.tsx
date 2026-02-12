import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../components/Cart';
import { useCheckout } from '../context/CheckoutContext';
import { CreditCard, Smartphone, Building2, ArrowLeft, ShoppingBag, Calendar, MapPin, User, Mail, Phone, MessageSquare, Upload, X as XIcon } from 'lucide-react';

interface CheckoutPageProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
}

export function CheckoutPage({ items, total, onClose }: CheckoutPageProps) {
  const navigate = useNavigate();
  const { setCustomerInfo, createOrder } = useCheckout();
  
  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Confirmation
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sinpe' | 'transfer'>('card');
  const [processing, setProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    deliveryMethod: 'pickup' as 'pickup' | 'delivery',
    deliveryDate: '',
    notes: '',
  });

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Formatear número de tarjeta
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }
    
    // Formatear fecha de expiración
    if (e.target.name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }
    
    // Limitar CVV
    if (e.target.name === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 4) return;
    }

    setCardData({
      ...cardData,
      [e.target.name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es muy grande. Máximo 5MB.');
        return;
      }
      
      // Validar tipo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Formato no válido. Solo JPG, PNG o PDF.');
        return;
      }
      
      setPaymentProof(file);
      
      // Crear preview para imágenes
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPaymentProofPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPaymentProofPreview('pdf');
      }
    }
  };

  const handleRemoveFile = () => {
    setPaymentProof(null);
    setPaymentProofPreview('');
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.deliveryDate) {
      alert('Por favor complete todos los campos requeridos');
      return false;
    }
    if (formData.deliveryMethod === 'delivery' && !formData.address) {
      alert('Por favor ingrese su dirección de entrega');
      return false;
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateStep1()) {
      setCustomerInfo(formData);
      setStep(2);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);

    try {
      if (paymentMethod === 'card') {
        // Validar datos de tarjeta
        if (!cardData.cardNumber || !cardData.cardName || !cardData.expiryDate || !cardData.cvv) {
          alert('Por favor complete todos los datos de la tarjeta');
          setProcessing(false);
          return;
        }

        // Aquí iría la integración real con Stripe
        await simulatePayment(2000);
        
        // Crear orden
        const order = await createOrder(items, total, paymentMethod);
        
        setStep(3);
      } else {
        // Para SINPE/Transferencia, validar comprobante
        if (!paymentProof) {
          alert('Por favor sube tu comprobante de pago antes de continuar');
          setProcessing(false);
          return;
        }

        // Aquí se subiría el comprobante al backend
        // Por ahora simulamos el envío
        await simulatePayment(1500);
        
        // Crear orden con estado pendiente
        const order = await createOrder(items, total, paymentMethod);
        
        setStep(3);
      }
    } catch (error) {
      console.error('Error procesando pago:', error);
      alert('Error al procesar el pago. Por favor intente nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  const simulatePayment = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const deliveryFee = formData.deliveryMethod === 'delivery' ? 2500 : 0;
  const finalTotal = total + deliveryFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-[#cd733d] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al carrito
          </button>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#cd733d]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#cd733d] text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="hidden sm:inline font-semibold">Información</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#cd733d]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#cd733d] text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="hidden sm:inline font-semibold">Pago</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#cd733d]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#cd733d] text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="hidden sm:inline font-semibold">Confirmación</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-serif text-gray-900 mb-6">Información de Entrega</h2>
                
                <div className="space-y-6">
                  {/* Método de entrega */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      ¿Cómo deseas recibir tu pedido?
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, deliveryMethod: 'pickup' })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.deliveryMethod === 'pickup'
                            ? 'border-[#cd733d] bg-[#cd733d]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-[#cd733d]" />
                        <p className="font-semibold">Recoger</p>
                        <p className="text-xs text-gray-500">Gratis</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, deliveryMethod: 'delivery' })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.deliveryMethod === 'delivery'
                            ? 'border-[#cd733d] bg-[#cd733d]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <MapPin className="w-6 h-6 mx-auto mb-2 text-[#cd733d]" />
                        <p className="font-semibold">Entrega</p>
                        <p className="text-xs text-gray-500">₡2,500</p>
                      </button>
                    </div>
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#cd733d] focus:outline-none"
                      placeholder="Juan Pérez"
                      required
                    />
                  </div>

                  {/* Email y Teléfono */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#cd733d] focus:outline-none"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#cd733d] focus:outline-none"
                        placeholder="8415-2888"
                        required
                      />
                    </div>
                  </div>

                  {/* Dirección (solo si es delivery) */}
                  {formData.deliveryMethod === 'delivery' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Dirección de Entrega *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#cd733d] focus:outline-none"
                        placeholder="San José, Guadalupe..."
                        required
                      />
                    </div>
                  )}

                  {/* Fecha de entrega */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Fecha de {formData.deliveryMethod === 'pickup' ? 'Retiro' : 'Entrega'} *
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#cd733d] focus:outline-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      📅 Recuerda: Pedidos para martes hasta sábado 3:00 PM / Pedidos para viernes hasta miércoles 3:00 PM
                    </p>
                  </div>

                  {/* Notas */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Notas Adicionales (Opcional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#cd733d] focus:outline-none"
                      placeholder="Instrucciones especiales, alergias, etc..."
                    />
                  </div>

                  <button
                    onClick={handleContinueToPayment}
                    className="w-full bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white py-4 rounded-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  >
                    Continuar al Pago
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-serif text-gray-900 mb-6">Método de Pago</h2>
                
                {/* Métodos de pago */}
                <div className="space-y-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                      paymentMethod === 'card'
                        ? 'border-[#cd733d] bg-[#cd733d]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-[#cd733d]" />
                    <div className="text-left flex-1">
                      <p className="font-semibold">Tarjeta de Crédito/Débito</p>
                      <p className="text-sm text-gray-500">Pago seguro con Stripe</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('sinpe')}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                      paymentMethod === 'sinpe'
                        ? 'border-[#cd733d] bg-[#cd733d]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 text-[#369db1]" />
                    <div className="text-left flex-1">
                      <p className="font-semibold">SINPE Móvil</p>
                      <p className="text-sm text-gray-500">Pago 100% anticipado</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('transfer')}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                      paymentMethod === 'transfer'
                        ? 'border-[#cd733d] bg-[#cd733d]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className="w-6 h-6 text-[#6d63ab]" />
                    <div className="text-left flex-1">
                      <p className="font-semibold">Transferencia Bancaria</p>
                      <p className="text-sm text-gray-500">Pago 100% anticipado</p>
                    </div>
                  </button>
                </div>

                {/* Formulario de tarjeta */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 mb-6 p-6 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Número de Tarjeta
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#cd733d] focus:outline-none font-mono"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre en la Tarjeta
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={cardData.cardName}
                        onChange={handleCardInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#cd733d] focus:outline-none"
                        placeholder="JUAN PEREZ"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Fecha de Expiración
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardData.expiryDate}
                          onChange={handleCardInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#cd733d] focus:outline-none font-mono"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCardInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#cd733d] focus:outline-none font-mono"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Instrucciones SINPE/Transferencia */}
                {(paymentMethod === 'sinpe' || paymentMethod === 'transfer') && (
                  <div className="mb-6 p-6 bg-gradient-to-br from-[#FFF8F0] to-white rounded-lg border-2 border-[#cd733d]/20">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Instrucciones de Pago
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700 mb-4">
                      <p>1. Realiza el pago del <strong>100% (₡{finalTotal.toLocaleString()})</strong></p>
                      {paymentMethod === 'sinpe' && (
                        <>
                          <p>2. SINPE al número: <strong className="text-[#cd733d]">8415-2888</strong></p>
                          <p>3. Nombre: <strong>Marcela Sánchez</strong></p>
                        </>
                      )}
                      {paymentMethod === 'transfer' && (
                        <>
                          <p>2. Banco: <strong>Banco Nacional de Costa Rica</strong></p>
                          <p>3. Cuenta IBAN: <strong>[Agregar IBAN aquí]</strong></p>
                          <p>4. A nombre de: <strong>Marcela Sánchez</strong></p>
                        </>
                      )}
                      <p className="font-semibold text-[#cd733d] mt-3">
                        4. Sube tu comprobante de pago abajo 👇
                      </p>
                    </div>

                    {/* Upload de comprobante */}
                    <div className="border-2 border-dashed border-[#cd733d]/30 rounded-lg p-6">
                      {!paymentProof ? (
                        <label className="cursor-pointer flex flex-col items-center">
                          <Upload className="w-12 h-12 text-[#cd733d] mb-2" />
                          <span className="text-sm font-semibold text-gray-700 mb-1">
                            Subir comprobante de pago
                          </span>
                          <span className="text-xs text-gray-500 mb-3">
                            JPG, PNG o PDF (máx. 5MB)
                          </span>
                          <span className="bg-[#cd733d] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#b35f2f] transition-colors">
                            Seleccionar archivo
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              {paymentProofPreview === 'pdf' ? (
                                <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center">
                                  <span className="text-xs font-bold text-red-600">PDF</span>
                                </div>
                              ) : (
                                <img
                                  src={paymentProofPreview}
                                  alt="Preview"
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="text-sm font-semibold text-gray-700">
                                  {paymentProof.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(paymentProof.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={handleRemoveFile}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <XIcon className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Comprobante cargado correctamente
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-[#cd733d] text-[#cd733d] py-4 rounded-lg hover:bg-[#cd733d]/5 transition-all font-semibold"
                  >
                    Volver
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="flex-1 bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white py-4 rounded-lg hover:shadow-xl transition-all duration-300 font-semibold disabled:opacity-50"
                  >
                    {processing ? 'Procesando...' : 'Confirmar Pedido'}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-3xl font-serif text-gray-900 mb-4">
                  ¡Pedido Confirmado!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  {paymentMethod === 'card' 
                    ? 'Tu pago ha sido procesado exitosamente. Recibirás un email de confirmación.'
                    : 'Hemos recibido tu pedido y comprobante. Lo verificaremos y te confirmaremos por email en las próximas horas.'}
                </p>

                <div className="bg-[#FFF8F0] rounded-lg p-6 mb-6 text-left">
                  <h3 className="font-semibold text-gray-900 mb-3">Detalles del Pedido</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha de {formData.deliveryMethod === 'pickup' ? 'retiro' : 'entrega'}:</span>
                      <span className="font-semibold">{formData.deliveryDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Método de pago:</span>
                      <span className="font-semibold">
                        {paymentMethod === 'card' ? 'Tarjeta' : paymentMethod === 'sinpe' ? 'SINPE' : 'Transferencia'}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold text-[#cd733d]">₡{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/');
                    }}
                    className="block w-full bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white py-4 rounded-lg hover:shadow-xl transition-all font-semibold"
                  >
                    Volver al Inicio
                  </button>
                  <a
                    href="https://wa.me/50684152888?text=Hola,%20tengo%20una%20consulta%20sobre%20mi%20pedido"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full border-2 border-[#25D366] text-[#25D366] py-4 rounded-lg hover:bg-[#25D366]/5 transition-all font-semibold text-center"
                  >
                    ¿Dudas? Contactar por WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-serif text-gray-900 mb-4">Resumen del Pedido</h3>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                      <p className="text-sm font-semibold text-[#cd733d]">
                        ₡{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₡{total.toLocaleString()}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-semibold">₡{deliveryFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-[#cd733d] text-lg">
                    ₡{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
