import 'server-only';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { capitulos } from '../content/capitulos.js';

// Avaliado na geração da página. Adicionar o PDF e gerar outro build libera o botão.
export function getCapitulos() {
  return capitulos.map((capitulo) => ({
    ...capitulo,
    pdfDisponivel: Boolean(capitulo.downloads?.pdf && existsSync(
      path.join(process.cwd(), 'public', capitulo.downloads.pdf),
    )),
  }));
}
