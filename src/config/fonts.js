import { Cormorant_Garamond, Source_Sans_3, Lora } from 'next/font/google';

// Semantic roles keep a change of typeface consistent across the whole book site.
export const displayFont = Cormorant_Garamond({
  variable: '--font-display', subsets: ['latin'], weight: ['400', '500', '600'],
  style: ['normal', 'italic'], display: 'swap',
});
export const interfaceFont = Source_Sans_3({
  variable: '--font-interface', subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap',
});
export const readingFont = Lora({
  variable: '--font-reading', subsets: ['latin'], weight: ['400', '500'],
  style: ['normal', 'italic'], display: 'swap',
});
