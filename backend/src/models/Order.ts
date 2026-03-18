import mongoose from 'mongoose';

const customerInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  deliveryMethod: { type: String, enum: ['pickup', 'delivery'], required: true },
  deliveryDate: { type: String, required: true },
  notes: String,
}, { _id: false });

const cartItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  quantity: Number,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  items: [cartItemSchema],
  customerInfo: customerInfoSchema,
  total: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['card', 'sinpe', 'transfer'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  orderStatus: { type: String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered'], default: 'pending' },
  paymentProofUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  paidAt: Date,
});

export const Order = mongoose.model('Order', orderSchema);
