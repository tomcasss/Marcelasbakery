import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../components/Cart';
import { useCheckout } from '../context/CheckoutContext';
import { DeliveryMap } from '../components/DeliveryMap';
import { startTilopayCheckout } from '../services/api';
import { Button } from '../components/ui/button';
import { FormInput } from '../components/ui/form-input';
import { FormTextarea } from '../components/ui/form-textarea';
import { FormError } from '../components/ui/form-error';
import { cn } from '../components/ui/utils';
import { CreditCard, Smartphone, Building2, ArrowLeft, ShoppingBag, Calendar, MapPin, User, Mail, Phone, MessageSquare, Upload, X as XIcon, CheckCircle2 } from 'lucide-react';

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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

  // Mapa de entrega
  const [deliveryCoords, setDeliveryCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [calculatedDeliveryFee, setCalculatedDeliveryFee] = useState<number | null>(null);


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

  const handleMapLocation = (lat: number, lng: number, fee: number | null) => {
    setDeliveryCoords({ lat, lng });
    setCalculatedDeliveryFee(fee);
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'El nombre es requerido';
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    if (!formData.phone.trim()) errors.phone = 'El teléfono es requerido';
    if (!formData.deliveryDate) errors.deliveryDate = 'La fecha de entrega es requerida';

    if (formData.deliveryMethod === 'delivery') {
      if (!deliveryCoords) errors.deliveryLocation = 'Por favor marca tu ubicación en el mapa';
      if (calculatedDeliveryFee === null && deliveryCoords) {
        errors.deliveryLocation = 'Tu ubicación está fuera de la zona de cobertura';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
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
        const cardDeliveryFee = formData.deliveryMethod === 'delivery' ? (calculatedDeliveryFee ?? 0) : 0;
        const cardTotal = total + cardDeliveryFee;
        const tempId = `TMP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        // Guardar datos en sessionStorage — PaymentResultPage los usa para crear el pedido
        sessionStorage.setItem('tilopay_session', JSON.stringify({
          items,
          total: cardTotal,
          customerInfo: formData,
          deliveryFee: cardDeliveryFee,
        }));
        sessionStorage.setItem('tilopay_temp_id', tempId);

        const { url } = await startTilopayCheckout({
          orderId: tempId,
          amount: cardTotal,
          customerInfo: formData,
        });

        window.location.href = url;
        return;
      } else {
        // Para SINPE/Transferencia, validar comprobante
        if (!paymentProof) {
          alert('Por favor sube tu comprobante de pago antes de continuar');
          setProcessing(false);
          return;
        }

        const deliveryFee = formData.deliveryMethod === 'delivery' ? (calculatedDeliveryFee ?? 0) : 0;
        // Sube el comprobante a Cloudinary y crea la orden con la URL
        await createOrder(items, total, paymentMethod, deliveryFee, paymentProof);
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

  const deliveryFee = formData.deliveryMethod === 'delivery' ? (calculatedDeliveryFee ?? 0) : 0;
  const finalTotal = total + deliveryFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al carrito
          </button>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
            <div className={cn("flex items-center gap-2 transition-colors", step >= 1 ? 'text-primary' : 'text-muted-foreground')}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                1
              </div>
              <span className="hidden sm:inline font-semibold text-sm">Información</span>
            </div>
            <div className={cn("h-0.5 w-8 sm:w-12 transition-colors", step >= 2 ? 'bg-primary' : 'bg-muted')}></div>
            <div className={cn("flex items-center gap-2 transition-colors", step >= 2 ? 'text-primary' : 'text-muted-foreground')}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                2
              </div>
              <span className="hidden sm:inline font-semibold text-sm">Pago</span>
            </div>
            <div className={cn("h-0.5 w-8 sm:w-12 transition-colors", step >= 3 ? 'bg-primary' : 'bg-muted')}></div>
            <div className={cn("flex items-center gap-2 transition-colors", step >= 3 ? 'text-primary' : 'text-muted-foreground')}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                3
              </div>
              <span className="hidden sm:inline font-semibold text-sm">Confirmación</span>
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
                        onClick={() => {
                          setFormData({ ...formData, deliveryMethod: 'pickup' });
                          setValidationErrors(prev => ({ ...prev, deliveryLocation: '' }));
                        }}
                        className={cn(
                          "p-4 sm:p-5 rounded-lg border-2 transition-all min-h-24 sm:min-h-28",
                          "flex flex-col items-center justify-center gap-2 active:scale-95",
                          formData.deliveryMethod === 'pickup'
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-muted-foreground hover:bg-accent'
                        )}
                      >
                        <ShoppingBag className="w-6 h-6 text-primary" />
                        <p className="font-semibold text-sm text-center">Recoger</p>
                        <p className="text-xs text-muted-foreground">Gratis</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, deliveryMethod: 'delivery' })}
                        className={cn(
                          "p-4 sm:p-5 rounded-lg border-2 transition-all min-h-24 sm:min-h-28",
                          "flex flex-col items-center justify-center gap-2 active:scale-95",
                          formData.deliveryMethod === 'delivery'
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-muted-foreground hover:bg-accent'
                        )}
                      >
                        <MapPin className="w-6 h-6 text-primary" />
                        <p className="font-semibold text-sm text-center">Entrega</p>
                        <p className="text-xs text-muted-foreground">
                          {deliveryCoords
                            ? calculatedDeliveryFee !== null
                              ? `₡${calculatedDeliveryFee.toLocaleString()}`
                              : 'Fuera de zona'
                            : 'Ver en mapa'}
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Nombre */}
                  <FormInput
                    type="text"
                    name="name"
                    label="Nombre Completo"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Juan Pérez"
                    required
                    error={validationErrors.name}
                  />

                  {/* Email y Teléfono */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormInput
                      type="email"
                      name="email"
                      label="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      required
                      error={validationErrors.email}
                    />
                    <FormInput
                      type="tel"
                      name="phone"
                      label="Teléfono"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="8415-2888"
                      required
                      error={validationErrors.phone}
                    />
                  </div>

                  {/* Mapa de entrega (solo si es delivery) */}
                  {formData.deliveryMethod === 'delivery' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-base font-medium mb-2 text-foreground">
                          Ubicación de Entrega
                          <span className="text-destructive ml-1">*</span>
                        </label>
                        <DeliveryMap
                          onLocationSelected={handleMapLocation}
                          initialCoords={deliveryCoords}
                        />
                        {validationErrors.deliveryLocation && (
                          <FormError message={validationErrors.deliveryLocation} type="error" />
                        )}
                      </div>
                      <FormInput
                        type="text"
                        name="address"
                        label="Señas adicionales"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Casa azul, 100m norte del parque..."
                        helperText="Instrucciones para encontrar tu dirección"
                      />
                    </div>
                  )}

                  {/* Fecha de entrega */}
                  <FormInput
                    type="date"
                    name="deliveryDate"
                    label={`Fecha de ${formData.deliveryMethod === 'pickup' ? 'Retiro' : 'Entrega'}`}
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    error={validationErrors.deliveryDate}
                    helperText="📅 Martes-Sábado 3:00 PM / Viernes-Miércoles 3:00 PM"
                  />

                  {/* Notas */}
                  <FormTextarea
                    name="notes"
                    label="Notas Adicionales"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Instrucciones especiales, alergias, etc..."
                    helperText="(Opcional) Cualquier información adicional para la panadería"
                  />

                  <Button
                    onClick={handleContinueToPayment}
                    size="lg"
                    className="w-full h-12"
                  >
                    Continuar al Pago
                  </Button>
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
                    className={cn(
                      "w-full p-4 sm:p-5 rounded-lg border-2 transition-all flex items-center gap-4 min-h-20",
                      "active:scale-95 hover:shadow-sm",
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground'
                    )}
                  >
                    <CreditCard className="w-6 h-6 text-primary shrink-0" />
                    <div className="text-left flex-1">
                      <p className="font-semibold">Tarjeta de Crédito/Débito</p>
                      <p className="text-sm text-muted-foreground">Pago seguro con Tilopay</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('sinpe')}
                    className={cn(
                      "w-full p-4 sm:p-5 rounded-lg border-2 transition-all flex items-center gap-4 min-h-20",
                      "active:scale-95 hover:shadow-sm",
                      paymentMethod === 'sinpe'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground'
                    )}
                  >
                    <Smartphone className="w-6 h-6 text-[#369db1] shrink-0" />
                    <div className="text-left flex-1">
                      <p className="font-semibold">SINPE Móvil</p>
                      <p className="text-sm text-muted-foreground">Pago 100% anticipado</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('transfer')}
                    className={cn(
                      "w-full p-4 sm:p-5 rounded-lg border-2 transition-all flex items-center gap-4 min-h-20",
                      "active:scale-95 hover:shadow-sm",
                      paymentMethod === 'transfer'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground'
                    )}
                  >
                    <Building2 className="w-6 h-6 text-[#6d63ab] shrink-0" />
                    <div className="text-left flex-1">
                      <p className="font-semibold">Transferencia Bancaria</p>
                      <p className="text-sm text-muted-foreground">Pago 100% anticipado</p>
                    </div>
                  </button>
                </div>

                {/* Formulario de tarjeta → reemplazado por Tilopay (redirección) */}
                {paymentMethod === 'card' && (
                  <div className="p-5 bg-[#FFF8F0] border border-[#cd733d]/20 rounded-xl mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#cd733d]/10 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-[#cd733d]" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Pago seguro vía Tilopay</p>
                        <p className="text-sm text-gray-500">Serás redirigido al formulario seguro de Tilopay para ingresar tu tarjeta.</p>
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
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    size="lg"
                    className="flex-1 h-12"
                  >
                    Volver
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={processing}
                    size="lg"
                    className="flex-1 h-12"
                  >
                    {processing ? 'Procesando...' : 'Confirmar Pedido'}
                  </Button>
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
                  <Button
                    onClick={() => {
                      onClose();
                      navigate('/');
                    }}
                    size="lg"
                    className="w-full h-12"
                  >
                    Volver al Inicio
                  </Button>
                  <a
                    href="https://wa.me/50684152888?text=Hola,%20tengo%20una%20consulta%20sobre%20mi%20pedido"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-12 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5"
                    >
                      ¿Dudas? Contactar por WhatsApp
                    </Button>
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
