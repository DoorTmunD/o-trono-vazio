// ============================================================
// CAPÍTULOS — Adicione o conteúdo do seu livro aqui
//
// Para cada capítulo:
//   numero  → texto exibido no topo do card (ex: 'Capítulo I')
//   titulo  → título do capítulo
//   epigrafe → frase opcional antes do texto (pode remover)
//   status  → 'disponivel' para liberar | 'em-breve' para ocultar
//   texto   → array de strings; cada string = um parágrafo
//
// Para adicionar um novo capítulo, copie um bloco { } completo
// e cole abaixo do último, separado por vírgula.
// ============================================================
export const capitulos = [
  {
    id: 1,
    numero: 'Capítulo I',
    titulo: 'O Despertar do Abismo',
    epigrafe: '"O primeiro passo para o abismo começa com uma escolha que parece insignificante."',
    status: 'disponivel',
    downloads: {
      pdf: '/capitulos/capitulo-1.pdf',
    },
    texto: [
      'Por dois milênios, o silêncio foi seu único companheiro, e a agonia, sua única certeza. No poço mais profundo do Inferno, onde a luz é um mito e a esperança um insulto, o Anjo Sereth foi forjado na tortura ininterrupta. Suas asas, outrora símbolos de glória, tornaram-se cicatrizes brancas de uma traição esquecida.',
      'Mas o destino tem mãos profanas.',
      'Resgatado pelas mãos de uma demônia e marcado pelo sangue de uma cruz invertida, Sereth caminha agora pelas ruas de uma Londres envolta em sombras e segredos. Com cabelos prateados manchados pela corrupção e olhos cinzentos como a névoa, ele não busca redenção, mas as respostas escondidas entre os livros da Biblioteca Maughan e os sussurros do submundo.',
      'Por que o anjo mais resiliente do cosmos foi condenado ao esquecimento? Que segredo seu Nome Verdadeiro esconde?',
      'Prepare-se para entrar em um mundo onde anjos queimam, demônios sangram e o vazio reclama seu trono. Conheça Sereth: o anjo que sobreviveu ao fim de todas as coisas para garantir que a sua jornada seja apenas o começo do caos.',
      'A ausência nunca pesou tanto. O Trono Vazio espera por você.',
    ],
  },
  {
    id: 2,
    numero: 'Capítulo II',
    titulo: 'A Lâmina e o Enigma',
    status: 'em-breve',
  },
  {
    id: 3,
    numero: 'Capítulo III',
    titulo: 'O Preço da Redenção',
    status: 'em-breve',
  },
  {
    id: 4,
    numero: 'Capítulo IV',
    titulo: 'Sangue e Cinzas',
    status: 'em-breve',
  },
  // Adicione mais capítulos aqui seguindo o padrão acima
];
