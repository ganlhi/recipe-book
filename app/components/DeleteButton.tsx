'use client';

import IconTrash from 'bootstrap-icons/icons/trash.svg';
import { useRef } from 'react';
import { deleteRecipe } from '@/app/actions';
import { redirect } from 'next/navigation';

export function DeleteButton({ recipeId }: { recipeId: string }) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button className="btn btn-soft btn-warning" onClick={() => ref.current?.showModal()}>
        <IconTrash /> Supprimer
      </button>
      <dialog ref={ref} className="modal">
        <div className="modal-box flex flex-col gap-3 w-max">
          <p>Êtes vous sûr(e) ?</p>
          <div className="flex gap-3">
            <button
              className="btn btn-warning"
              onClick={() => {
                deleteRecipe(recipeId).then(() => {
                  ref.current?.close();
                  redirect('/');
                });
              }}
            >
              Oui, supprimer la recette
            </button>
            <button className="btn" onClick={() => ref.current?.close()}>
              Non, conserver la recette
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
