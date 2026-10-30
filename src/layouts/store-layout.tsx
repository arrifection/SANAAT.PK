import { Outlet, ScrollRestoration } from 'react-router-dom';
import { AnnouncementBar, Header, Footer, FloatingWhatsApp } from '../components/layout';
import { CartDrawer } from '../components/cart';

export function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-plum selection:text-white">
      <ScrollRestoration />
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
    </div>
  );
}
