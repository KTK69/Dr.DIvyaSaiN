import { NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

// Clean date formatter helper for IST
function formatDateTime(isoString: string) {
  try {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata", // Default to India Standard Time
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return isoString;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received Calendly webhook:", JSON.stringify(body));

    // Handle invitee.created (new booking)
    if (body.event === "invitee.created") {
      const invitee = body.payload;
      const eventInfo = invitee.scheduled_event;

      const name = invitee.name || "A user";
      const email = invitee.email || "No email";
      const eventName = eventInfo?.name || "Consultation";
      const startTime = eventInfo?.start_time ? formatDateTime(eventInfo.start_time) : "Not specified";
      const joinUrl = eventInfo?.location?.join_url || eventInfo?.location?.location || "";

      let message = `📅 *New Booking on Calendly!*\n\n`;
      message += `👤 *Name:* ${name}\n`;
      message += `✉️ *Email:* ${email}\n`;
      message += `📋 *Type:* ${eventName}\n`;
      message += `⏰ *Time:* ${startTime} (IST)\n`;

      if (joinUrl) {
        message += `🔗 *Meeting Link:* ${joinUrl}\n`;
      }

      await sendWhatsAppMessage(message);

      return NextResponse.json({ ok: true, message: "WhatsApp notification sent successfully." });
    }

    // Handle invitee.canceled (booking cancellation)
    if (body.event === "invitee.canceled") {
      const invitee = body.payload;
      const eventInfo = invitee.scheduled_event;

      const name = invitee.name || "A user";
      const eventName = eventInfo?.name || "Consultation";
      const startTime = eventInfo?.start_time ? formatDateTime(eventInfo.start_time) : "Not specified";

      let message = `❌ *Booking Canceled on Calendly*\n\n`;
      message += `👤 *Name:* ${name}\n`;
      message += `📋 *Type:* ${eventName}\n`;
      message += `⏰ *Scheduled Time:* ${startTime} (IST)\n`;

      await sendWhatsAppMessage(message);

      return NextResponse.json({ ok: true, message: "WhatsApp cancellation notification sent." });
    }

    return NextResponse.json({ ok: true, message: "Event type not handled." });
  } catch (error) {
    console.error("Calendly webhook handler failed:", error);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
