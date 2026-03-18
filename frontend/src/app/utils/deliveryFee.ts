export const BAKERY = {
  lat: 9.9557899,
  lng: -84.0414168,
  name: "La Gracia by Marcela's Bakery",
  address: 'Frente al Colegio Madre del Divino Pastor, Guadalupe, San José',
};

const BASE_FEE = 1500;
const FEE_PER_KM = 400;
const MAX_KM = 20;
// Factor de corrección: carretera ~30% más que línea recta
const ROAD_FACTOR = 1.3;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export interface DeliveryFeeResult {
  straightKm: number;
  estimatedRoadKm: number;
  fee: number | null; // null = fuera de cobertura
}

export function calcDeliveryFee(lat: number, lng: number): DeliveryFeeResult {
  const straightKm = haversineKm(BAKERY.lat, BAKERY.lng, lat, lng);
  const estimatedRoadKm = straightKm * ROAD_FACTOR;

  if (estimatedRoadKm > MAX_KM) {
    return { straightKm, estimatedRoadKm, fee: null };
  }

  // Redondear al 100 más cercano para precios limpios
  const fee = Math.round((BASE_FEE + estimatedRoadKm * FEE_PER_KM) / 100) * 100;
  return { straightKm, estimatedRoadKm, fee };
}

export const MAX_COVERAGE_KM = MAX_KM;
