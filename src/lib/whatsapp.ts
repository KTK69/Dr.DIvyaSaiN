import "server-only";

export async function sendWhatsAppMessage(text: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";
  const to = process.env.DOCTOR_WHATSAPP_TO;

  if (!accountSid || !authToken || !to) {
    console.warn("Skipping WhatsApp notification: Missing Twilio environment variables.");
    return;
  }

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const response = await fetch(twilioUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      From: from,
      To: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
      Body: text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Twilio WhatsApp request failed: ${response.status} - ${errorText}`);
  }

  return await response.json();
}
