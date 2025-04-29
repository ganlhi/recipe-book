'use client';

import IconSearch from 'bootstrap-icons/icons/search.svg';
import { toggleFilterableIngredient } from '@/app/actions';
import { useRouter } from 'next/navigation';

export function ToggleFilterableButton({
  ingredient,
  isFilterable,
}: {
  ingredient: string;
  isFilterable: boolean;
}) {
  const router = useRouter();
  return (
    <div
      className="tooltip"
      data-tip={isFilterable ? 'Supprimer des filtres' : 'Ajouter aux filtres'}
    >
      <button
        className="btn btn-square btn-ghost"
        onClick={() => {
          toggleFilterableIngredient(ingredient).then(() => {
            router.refresh();
          });
        }}
      >
        <IconSearch /> {isFilterable ? '-' : '+'}
      </button>
    </div>
  );
}
