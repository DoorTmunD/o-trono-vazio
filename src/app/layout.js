import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
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
        width: 1200,
        height: 630,
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0505] text-gray-200`}>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
