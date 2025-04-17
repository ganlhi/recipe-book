import IconGrid from 'bootstrap-icons/icons/grid.svg';
import IconTable from 'bootstrap-icons/icons/table.svg';
import { RecipesList } from '@/app/components/RecipesList';
import { RecipesListViewMode, SearchParams } from '@/lib/types';
import { getRecipesListFilters, updateQueryString } from '@/lib/utils';
import { clsx } from 'clsx';
import Link from 'next/link';
import { Filters } from '@/app/components/Filters';
import prisma from '@/lib/prisma';

export default async function Home(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const filters = getRecipesListFilters(searchParams);
  const viewMode: RecipesListViewMode = searchParams.view === 'table' ? 'table' : 'grid';

  const filterableIngredients = (
    await prisma.filterableIngredient.findMany({
      orderBy: { name: 'asc' },
    })
  ).map((i) => i.name);

  return (
    <>
      <header className="prose">
        <h1>Recettes</h1>
      </header>

      <Filters filters={filters} viewMode={viewMode} availableIngredients={filterableIngredients} />

      <Link
        href={`?${updateQueryString(searchParams, { view: viewMode === 'grid' ? 'table' : 'grid' })}`}
        className="block mb-4"
      >
        <label className={clsx('swap swap-rotate', { 'swap-active': viewMode === 'table' })}>
          <span className="swap-on">
            <IconTable />
          </span>
          <span className="swap-off">
            <IconGrid />
          </span>
          <span className="block h-0 w-0 overflow-hidden">Bascule vue grille/table</span>
        </label>
      </Link>

      <RecipesList filters={filters} viewMode={viewMode} />
    </>
  );
}
