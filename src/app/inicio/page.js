import InicioExperience from './InicioExperience';

export const metadata = {
  title: { absolute: 'O Trono Vazio' },
  alternates: { canonical: '/inicio' },
  openGraph: {
    title: 'O Trono Vazio',
    description: 'Explore uma saga de dark fantasy onde luz e sombras colidem.',
    url: '/inicio',
    images: ['/capa-biblioteca.png'],
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function Inicio() {
  return <InicioExperience />;
}
