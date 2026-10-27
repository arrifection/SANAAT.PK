import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../../content/site-config';

export function FloatingWhatsApp() {
  const defaultMessage = encodeURIComponent('Hi Sanaat, I have an enquiry regarding a piece.');
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${defaultMessage}`;

  return (
    <aside
      aria-label="Contact Sanaat via WhatsApp"
      className="fixed bottom-6 right-4 sm:right-6 z-40 transition-all duration-300"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Sanaat on WhatsApp"
        className="group flex items-center gap-2.5 bg-black hover:bg-plum text-white px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
      >
        <div className="relative flex items-center justify-center">
          <MessageCircle className="h-5 w-5 stroke-[1.75]" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-sans font-medium uppercase tracking-widest">
          WhatsApp Us
        </span>
      </a>
    </aside>
  );
}
