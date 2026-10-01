'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { displayFont } from '@/config/fonts';

export default function CodexDialog({ itemSelecionado, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="codex-dialog-title"
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = event.currentTarget.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey ? document.activeElement === first : document.activeElement === last) {
          event.preventDefault();
          const target = event.shiftKey ? last : first;
          if (target instanceof HTMLElement) target.focus();
        }
      }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="codex-dialog fixed inset-0 m-auto w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] max-w-4xl max-h-[90dvh] overflow-visible bg-transparent p-0 text-neutral-200"
    >
          <div className="relative w-full max-w-4xl max-h-[90dvh] bg-neutral-950 border border-neutral-800 flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] animate-zoom-in-95">

            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 border border-neutral-700 text-white flex items-center justify-center hover:bg-red-900 hover:border-red-500 transition-colors"
              aria-label="Fechar"
            >
              ✕
            </button>

            <div className="relative w-full md:w-2/5 h-48 shrink-0 md:h-auto">
              {itemSelecionado.imagem ? (
                <>
                  <Image src={itemSelecionado.imagem} alt={itemSelecionado.nome} fill sizes="(max-width: 768px) 100vw, 360px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-950 via-transparent to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/10 via-neutral-900 to-neutral-950 flex items-center justify-center">
                  <div className="relative flex flex-col items-center gap-4">
                    <div className="w-32 h-56 bg-gradient-to-b from-neutral-600/15 via-neutral-700/8 to-transparent rounded-[40%] blur-3xl" />
                    <span className="absolute bottom-0 text-neutral-700 text-xs tracking-widest uppercase">Na sombra</span>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full md:w-3/5 min-h-0 p-6 sm:p-8 md:p-12 overflow-y-auto scrollbar-hide">
              <span className="text-amber-600 font-bold tracking-widest text-xs uppercase mb-2 block">
                {itemSelecionado.titulo}
              </span>
              <h2 id="codex-dialog-title" className={`${displayFont.className} text-3xl sm:text-4xl text-white mb-8 border-b border-neutral-800 pb-4`}>
                {itemSelecionado.nome}
              </h2>

              {itemSelecionado.tipo === 'Personagem' && (
                <div className="grid grid-cols-2 gap-6 mb-8 bg-neutral-900/50 p-6 border border-neutral-800/50">
                  <div>
                    <span className="text-neutral-500 text-xs uppercase tracking-widest block mb-1">Idade</span>
                    <span className="text-white text-sm">{itemSelecionado.idade}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-xs uppercase tracking-widest block mb-1">Altura</span>
                    <span className="text-white text-sm">{itemSelecionado.altura}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-neutral-500 text-xs uppercase tracking-widest block mb-1">Gostos</span>
                    <span className="text-white text-sm">{itemSelecionado.gostos}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-neutral-500 text-xs uppercase tracking-widest block mb-1">Desgostos</span>
                    <span className="text-red-400 text-sm">{itemSelecionado.desgostos}</span>
                  </div>
                </div>
              )}

              <div>
                <span className="text-neutral-500 text-xs uppercase tracking-widest block mb-4 border-l-2 border-red-800 pl-3">
                  Registros Históricos
                </span>
                <p className="text-neutral-300 font-light leading-relaxed text-sm">
                  {itemSelecionado.historia}
                </p>
              </div>
            </div>
          </div>
    </dialog>
  );
}
