import { CartItem, Product, ProductSize } from '../types';

export const WHATSAPP_PHONE = '918870123806';
export const FORMATTED_PHONE = '+91 8870123806';

/**
 * Creates an international WhatsApp click-to-chat URL with properly encoded message.
 * format: https://wa.me/<number>?text=<encoded_text>
 */
export function createWhatsAppChatUrl(message: string): string {
  const cleanPhone = WHATSAPP_PHONE.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

/**
 * Builds prefilled message for ordering a specific product item
 */
export function buildProductWhatsAppMessage(params: {
  productName: string;
  size: ProductSize;
  color: string;
  quantity: number;
  unitPrice: number;
  handle?: string;
}): string {
  const totalPrice = params.unitPrice * params.quantity;
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return `Hello THE STANE PROJECT Team,
I would like to order the following garment:

• Product: ${params.productName}
• Size: ${params.size}
• Colour: ${params.color}
• Quantity: ${params.quantity}
• Unit Price: ₹${params.unitPrice.toLocaleString('en-IN')}
• Total Estimated: ₹${totalPrice.toLocaleString('en-IN')}

${params.handle ? `Product Reference: ${currentUrl}?product=${params.handle}` : ''}

Please confirm availability and share payment/delivery steps for my location. Thank you!`;
}

/**
 * Builds prefilled message for ordering entire cart via WhatsApp
 */
export function buildCartWhatsAppMessage(cart: CartItem[], subtotal: number, shipping: number, total: number): string {
  const itemsList = cart
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.productName} [${item.size} / ${item.color}] × ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
    )
    .join('\n');

  return `Hello THE STANE PROJECT Team,
I would like to place an order for the following items in my bag:

${itemsList}

Subtotal: ₹${subtotal.toLocaleString('en-IN')}
Shipping: ${shipping === 0 ? 'FREE' : `₹${shipping}`}
Estimated Total: ₹${total.toLocaleString('en-IN')}

Please verify stock and send me the payment / order confirmation instructions. Thank you!`;
}

/**
 * Builds prefilled message for order inquiry / order tracking support
 */
export function buildOrderInquiryWhatsAppMessage(orderId: string, customerName?: string): string {
  return `Hello THE STANE PROJECT Support,
I am inquiring about my order:
• Order ID: ${orderId}
${customerName ? `• Customer Name: ${customerName}` : ''}

Could you please provide the latest dispatch / delivery status? Thank you!`;
}
