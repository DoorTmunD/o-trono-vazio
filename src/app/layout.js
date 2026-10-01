import { displayFont, interfaceFont, readingFont } from '@/config/fonts';
import "./globals.css";
import { getSiteUrl } from "@/config/site";
import PageTransition from "@/components/layout/PageTransition";

export const metadata = {
  metadataBase: getSiteUrl(),
  alternates: { canonical: "/" },
  title: {
    default: 'O Trono Vazio',
    template: '%s | O Trono Vazio',
  },
  description: 'Uma saga de Dark Fantasy onde luz e sombras colidem. Acompanhe a jornada de Sereth, Hana, Maria, Tom e Lea.',
  openGraph: {
    title: 'O Trono Vazio',
    description: 'Uma saga de Dark Fantasy onde luz e sombras colidem. Os segredos aguardam no Santuário.',
    images: [
      {
        url: '/capa-biblioteca.png',
        alt: 'O Trono Vazio — Capa da Biblioteca',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'O Trono Vazio',
    description: 'Uma saga de Dark Fantasy onde luz e sombras colidem.',
    images: ['/capa-biblioteca.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${displayFont.variable} ${interfaceFont.variable} ${readingFont.variable} ${interfaceFont.className} antialiased`}>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
