import { Cinzel, Montserrat, Lora } from 'next/font/google';

export const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });
export const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });
export const lora = Lora({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'] });
