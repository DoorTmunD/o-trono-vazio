import { personagens } from './personagens.js';

export const artefatos = [];

export const lores = [
    {
      tipo: 'Lore', id: 'a-queda',
      nome: 'A Noite das Cinzas', titulo: 'Evento Histórico',
      imagem: null,
      imagemReferencia: 'https://images.unsplash.com/photo-1473654729513-2070f7f3296c?q=80&w=800&auto=format&fit=crop',
      historia: 'Antes de O Trono Vazio, houve a Noite das Cinzas. Foi quando as velhas alianças foram queimadas e a escuridão reivindicou seu espaço. Este evento moldou as regras do tabuleiro em que nossos heróis (e vilões) jogam hoje.',
    },
  ];

export const todasCategorias = [
    { label: 'Personagens', itens: personagens },
    { label: 'Lore', itens: lores },
    { label: 'Artefatos', itens: artefatos },
  ];
