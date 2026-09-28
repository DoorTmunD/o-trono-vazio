// ============================================================
// PERSONAGENS — Fonte única de verdade.
// Consumido por /santuario (carrossel) e /codex (galeria + modal).
//
// Para adicionar um personagem, copie um bloco { } e cole abaixo.
// Imagem em /public ou null para exibir o placeholder de sombra.
// ============================================================
export const personagens = [
  {
    tipo: 'Personagem',
    id: 'sereth',
    nome: 'Sereth',
    titulo: 'O Enigma',
    imagem: '/Sereth.jpg',
    idade: 'Desconhecida',
    altura: '2,03m',
    gostos: 'Silêncio, xadrez, leitura',
    desgostos: 'Perguntas indiscretas, multidões',
    resumo: 'A bengala dita o ritmo de passos que escondem segredos profundos.',
    historia: 'Pouco se sabe sobre o passado de Sereth antes de sua chegada. Ele carrega consigo segredos antigos e um olhar que parece ler a alma daqueles que ousam encará-lo por muito tempo.',
  },
  {
    tipo: 'Personagem',
    id: 'hana',
    nome: 'Ha-Neul (Hana)',
    titulo: 'A Lâmina',
    imagem: '/Hana.jpg',
    idade: '???',
    altura: '1.65m',
    gostos: 'café, musica, tatuagem, filmes de terror',
    desgostos: 'Hesitação, traição',
    resumo: 'A precisão forjada nas sombras de um passado distante.',
    historia: 'Forjada nas sombras de um passado que ela tenta esquecer, Hana é a precisão em forma humana. Cada movimento seu é calculado, cada palavra é letal. Ela encontrou no grupo uma utilidade para suas habilidades, mas a lealdade verdadeira ainda é algo que ela guarda a sete chaves.',
  },
  {
    tipo: 'Personagem',
    id: 'maria',
    nome: 'Maria B',
    titulo: 'A Devota',
    imagem: null,
    // Referência preservada; o retrato fica em sombra até existir uma arte local.
    imagemReferencia: 'https://images.unsplash.com/photo-1519068737630-e5db30e12e42?q=80&w=800&auto=format&fit=crop',
    idade: '27',
    altura: '1.69m',
    gostos: 'leitura, terror, adrenalina, liberdade',
    desgostos: 'Solidão, esquecimento, confinamento',
    resumo: 'A fé inabalável guiando o grupo pela escuridão.',
    historia: 'Sua linhagem remonta aos mais antigos reis ingleses, um passado não muito colorido marca sua história, sua vida salva e guiada pelo Anjo Prateado, tem tudo para ir no rumo que ela sempre quis.',
  },
  {
    tipo: 'Personagem',
    id: 'lea',
    nome: 'Leanor (Lea)',
    titulo: 'A Sombra',
    imagem: null,
    idade: '157',
    altura: '1.76m',
    gostos: 'Mar, Atletismo, Pessoas Inteligentes, Deus',
    desgostos: 'Prisão, correntes, ser posta à mostra (modelo)',
    resumo: 'Os passos silenciosos que ninguém vê chegar.',
    historia: 'Leanor busca somente uma coisa, paz. A paz que ela nunca teve na vida, o trabalho de caçadora foi um meio que ela encontrou de tentar uma redenção pelo que é, e um dia enfim poder obter a paz que tanto almeja.',
  },
  {
    tipo: 'Personagem',
    id: 'tom',
    nome: 'Thomas (Tom)',
    titulo: 'O Escudo',
    imagem: '/Tom.JPG',
    idade: '157',
    altura: '1.89m',
    gostos: 'Cerveja, animais, esportes, dinheiro',
    desgostos: 'Maldade, violência, guerra',
    resumo: 'A mente que calcula cada movimento no tabuleiro.',
    historia: 'Tom já foi ambicioso, já quis ter sucesso, mas hoje a felicidade da irmã basta para ele, o trauma de guerras vividas mudou sua forma de enxergar o mundo.',
  },
];
