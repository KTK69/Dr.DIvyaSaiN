export const WHATSAPP_NUMBER = "919900135489";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hello Dr. Divya Sai Narsingam, I would like to book a consultation.";

export function buildWhatsAppLink(message = WHATSAPP_DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_INSTANT_REPLY_NOTE =
  "If we are in surgery or away from the phone, your WhatsApp message will still be acknowledged and followed up as soon as possible.";

export const WHATSAPP_FOLLOW_UP_MESSAGE =
  "Hello Dr. Divya Sai Narsingam, I would like to follow up on my consultation request.";
