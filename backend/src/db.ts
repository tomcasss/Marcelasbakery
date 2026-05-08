import mongoose from 'mongoose';

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Falta MONGODB_URI en .env');
  }

  try {
    await mongoose.connect(uri);
    console.log('✓ Conectado a MongoDB');
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠ MongoDB no disponible - continuando en modo prueba (sin persistencia)');
      return;
    }
    throw err;
  }
}
