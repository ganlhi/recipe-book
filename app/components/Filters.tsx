'use client';

import IconSearch from 'bootstrap-icons/icons/search.svg';
import IconXLarge from 'bootstrap-icons/icons/x-lg.svg';
import IconX from 'bootstrap-icons/icons/x.svg';
import IconPlus from 'bootstrap-icons/icons/plus.svg';
import { RecipesListFilters, RecipesListViewMode } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { EMPTY_FILTERS } from '@/lib/utils';

export function Filters({
  filters: initialFilters,
  viewMode,
  availableIngredients,
}: {
  filters: RecipesListFilters;
  viewMode: RecipesListViewMode;
  availableIngredients: string[];
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [filters, setFilters] = useState(initialFilters);
  const hasFilters = !!filters.name || filters.ingredients.length > 0;
  const router = useRouter();

  function applyFilters() {
    const sp = new URLSearchParams();
    sp.set('view', viewMode);
    if (hasFilters) sp.set('filters', JSON.stringify(filters));
    router.push(`?${sp.toString()}`);
  }

  return (
    <div>
      <form
        className="flex gap-2 items-center py-4"
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters();
        }}
      >
        <label className="input">
          <span className="label">Nom :</span>
          <input
            type="text"
            placeholder="Filtrer par nom"
            name="name"
            value={filters.name}
            onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
          />
        </label>
        <div className="border border-[color-mix(in_oklab,_var(--color-base-content)_20%,_#0000)] rounded-sm h-10 items-center flex px-3">
          <span className="label text-sm border-r border-inherit pr-3 mr-3">Ingrédients :</span>
          <input
            type="text"
            id="filter-ingredients"
            name="ingredients"
            value={filters.ingredients.join(',')}
            readOnly
            className="hidden"
          />
          <div className="flex gap-1">
            {filters.ingredients.map((ingredient) => (
              <div className="join" key={ingredient}>
                <div className="btn btn-sm join-item pointer-events-none">{ingredient}</div>
                <button
                  type="button"
                  className="btn btn-sm btn-square join-item"
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      ingredients: f.ingredients.filter((i) => i !== ingredient),
                    }))
                  }
                >
                  <IconX />
                </button>
              </div>
            ))}
            <div className="tooltip" data-tip="Filtrer par ingrédient">
              <button
                type="button"
                className="btn btn-sm btn-square"
                disabled={filters.ingredients.length >= 3}
                onClick={() => ref.current?.showModal()}
              >
                <IconPlus />
              </button>
            </div>
          </div>
        </div>

        <div className="tooltip" data-tip="Appliquer les filtres">
          <button className="btn btn-square">
            <IconSearch />
          </button>
        </div>
        <div className="tooltip" data-tip="Supprimer les filtres">
          <button
            className="btn btn-square"
            type="button"
            disabled={!hasFilters}
            onClick={() => {
              setFilters(EMPTY_FILTERS);
              router.push(`?view=${viewMode}`);
            }}
          >
            <IconXLarge />
          </button>
        </div>
      </form>

      <dialog ref={ref} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Sélectionner un ingrédient :</h3>

          <div className="flex flex-wrap gap-2 mt-4">
            {availableIngredients.map((fi) =>
              filters.ingredients.includes(fi) ? null : (
                <button
                  key={fi}
                  className="btn btn-sm"
                  onClick={() => {
                    setFilters((f) => ({ ...f, ingredients: [...f.ingredients, fi] }));
                    ref.current?.close();
                  }}
                >
                  {fi}
                </button>
              ),
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}
