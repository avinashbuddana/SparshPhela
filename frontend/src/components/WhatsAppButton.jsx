import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const number = "919876543210";
  const text = encodeURIComponent("Hello Sparsh Pehla, I'd love to know more about your maternity wellness services.");
  return (
    <a
      href={`https://wa.me/${number}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-float-button"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
        <MessageCircle fill="white" strokeWidth={0} size={28} />
      </span>
    </a>
  );
}
