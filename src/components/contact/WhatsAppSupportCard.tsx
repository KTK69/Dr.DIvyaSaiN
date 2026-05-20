import { MessageCircle, PhoneCall, RefreshCw } from "lucide-react";
import { buildWhatsAppLink, WHATSAPP_FOLLOW_UP_MESSAGE, WHATSAPP_INSTANT_REPLY_NOTE } from "@/lib/communication";

export default function WhatsAppSupportCard() {
  const chatLink = buildWhatsAppLink();
  const followUpLink = buildWhatsAppLink(WHATSAPP_FOLLOW_UP_MESSAGE);

  return (
    <div className="glass-card rounded-2xl p-7 border border-(--border)">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl" style={{ background: "#25D366", color: "white" }}>
          <MessageCircle size={20} />
        </div>
        <div>
          <h2 className="text-xl font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
            WhatsApp quick response
          </h2>
          <p className="mt-2 text-base text-(--foreground-muted) leading-relaxed">
            {WHATSAPP_INSTANT_REPLY_NOTE}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <a
          href={chatLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-5 py-4 text-base font-medium text-white transition-colors"
          style={{ background: "#25D366" }}
        >
          <PhoneCall size={18} />
          Chat on WhatsApp
        </a>

        <a
          href={followUpLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-(--border) px-5 py-4 text-base text-(--foreground-muted) hover:border-(--accent-gold) hover:text-(--foreground) transition-colors"
        >
          <RefreshCw size={18} />
          Follow up on an existing request
        </a>
      </div>

      <p className="mt-5 text-sm text-(--foreground-subtle) leading-relaxed">
        For urgent issues, please contact the hospital directly or visit the emergency department.
      </p>
    </div>
  );
}
