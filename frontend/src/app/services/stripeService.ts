// Archivo de configuración para Stripe
// Este archivo debe usarse cuando integres el backend

// NOTA: Para usar este archivo, primero instala las dependencias:
// npm install @stripe/stripe-js @stripe/react-stripe-js

// Descomenta el código abajo cuando tengas Stripe configurado

/*
import { loadStripe } from '@stripe/stripe-js';

// ⚠️ IMPORTANTE: Esta clave debe venir de variables de entorno
// En Vite, usa VITE_STRIPE_PUBLISHABLE_KEY
// En producción, usa la clave pk_live_...
// En desarrollo, usa la clave pk_test_...

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Inicializar Stripe
export const stripePromise = loadStripe(stripePublicKey);

// Configuración de Stripe para Costa Rica
export const stripeConfig = {
  locale: 'es' as const,
  country: 'CR',
  currency: 'crc', // Colones costarricenses
};

// Función para crear un Payment Intent (debe llamarse desde el backend)
export interface CreatePaymentIntentRequest {
  amount: number; // En colones
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// Esta función debe hacer una llamada a tu backend
export async function createPaymentIntent(
  data: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> {
  // TODO: Reemplazar con tu endpoint real
  const response = await fetch('/api/payments/create-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error creando payment intent');
  }

  return response.json();
}

// Función para confirmar el pago
export async function confirmPayment(
  stripe: any,
  clientSecret: string,
  paymentMethodId: string
) {
  const { error, paymentIntent } = await stripe.confirmCardPayment(
    clientSecret,
    {
      payment_method: paymentMethodId,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  return paymentIntent;
}

// Tipos de errores de Stripe
export const StripeErrorCodes = {
  CARD_DECLINED: 'card_declined',
  INSUFFICIENT_FUNDS: 'insufficient_funds',
  EXPIRED_CARD: 'expired_card',
  INCORRECT_CVC: 'incorrect_cvc',
  PROCESSING_ERROR: 'processing_error',
};

// Mensajes de error en español
export const getStripeErrorMessage = (errorCode: string): string => {
  const messages: Record<string, string> = {
    card_declined: 'Tu tarjeta fue rechazada. Por favor intenta con otra tarjeta.',
    insufficient_funds: 'Fondos insuficientes en la tarjeta.',
    expired_card: 'Tu tarjeta está vencida.',
    incorrect_cvc: 'El código de seguridad (CVV) es incorrecto.',
    processing_error: 'Error procesando el pago. Por favor intenta nuevamente.',
    invalid_number: 'El número de tarjeta no es válido.',
    invalid_expiry_month: 'El mes de expiración no es válido.',
    invalid_expiry_year: 'El año de expiración no es válido.',
  };

  return messages[errorCode] || 'Error procesando el pago. Por favor contacta soporte.';
};

export default {
  stripePromise,
  stripeConfig,
  createPaymentIntent,
  confirmPayment,
  getStripeErrorMessage,
};
*/

// Exportación temporal vacía hasta que se configure Stripe
export default {};
