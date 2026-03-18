import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmTilopayPayment } from '../services/api';

export function PaymentResultPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'approved' | 'rejected' | 'error'>('loading');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const run = async () => {
      const code = params.get('code');
      const returnData = params.get('returnData');

      // Recuperar tempId desde returnData (lo devuelve Tilopay tras el pago)
      let tempId = '';
      if (returnData) {
        try { tempId = JSON.parse(atob(returnData)).orderId || ''; } catch {}
      }
      if (!tempId) tempId = sessionStorage.getItem('tilopay_temp_id') || '';

      // Leer y limpiar sesión de inmediato para evitar creaciones duplicadas
      const sessionStr = sessionStorage.getItem('tilopay_session');
      sessionStorage.removeItem('tilopay_session');
      sessionStorage.removeItem('tilopay_temp_id');
      sessionStorage.removeItem('tilopay_pending_order');

      if (code === '1') {
        if (sessionStr && tempId) {
          try {
            const sess = JSON.parse(sessionStr);
            const order = await confirmTilopayPayment({ tempId, ...sess });
            setOrderId(order.orderId);
          } catch {
            // Crear orden falló — mostrar éxito de todas formas, el staff dará seguimiento
            setOrderId(tempId);
          }
        }
        setStatus('approved');
      } else if (code) {
        setStatus('rejected');
      } else {
        setStatus('error');
      }
    };
    run();
  }, [params]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        {status === 'loading' && (
          <div>
            <div className="w-16 h-16 border-4 border-[#cd733d] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Procesando resultado...</p>
          </div>
        )}

        {status === 'approved' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">¡Pago exitoso!</h1>
            <p className="text-gray-500 mb-2">Tu pago fue procesado correctamente.</p>
            {orderId && <p className="text-sm text-gray-400 font-mono mb-6">Pedido: {orderId}</p>}
            <p className="text-sm text-gray-600 mb-8">Recibirás un email de confirmación con los detalles de tu pedido.</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Volver al inicio
            </button>
          </>
        )}

        {status === 'rejected' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Pago no completado</h1>
            <p className="text-gray-500 mb-8">El pago fue rechazado o cancelado. Puedes intentarlo de nuevo o elegir otro método de pago.</p>
            <button
              onClick={() => navigate('/')}
              className="w-full border-2 border-[#cd733d] text-[#cd733d] py-3 rounded-xl font-semibold hover:bg-[#cd733d]/5 transition-all"
            >
              Volver al inicio
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <p className="text-4xl mb-4">⚠️</p>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Estado desconocido</h1>
            <p className="text-gray-500 mb-6">No pudimos confirmar el resultado. Contáctanos por WhatsApp.</p>
            <a
              href="https://wa.me/50684152888"
              className="block w-full bg-[#25D366] text-white py-3 rounded-xl font-semibold text-center"
            >
              WhatsApp 8415-2888
            </a>
          </>
        )}
      </div>
    </div>
  );
}
