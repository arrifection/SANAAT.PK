import { Outlet } from 'react-router-dom';
import { AnnouncementBar, Header, Footer } from '../components/layout';
import { CartDrawer } from '../components/cart';

export function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-plum selection:text-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
