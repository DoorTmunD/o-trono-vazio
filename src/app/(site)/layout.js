import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { montserrat } from '@/config/fonts';

export default function SiteLayout({ children }) {
  return (
    <div className={`${montserrat.className} min-h-screen bg-[#08090a] text-[#eee8dc]`}>
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
