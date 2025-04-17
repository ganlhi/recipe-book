import IconGrid from 'bootstrap-icons/icons/grid.svg';
import IconTable from 'bootstrap-icons/icons/table.svg';
import { RecipesList } from '@/app/components/RecipesList';
import { RecipesListViewMode, SearchParams } from '@/lib/types';
import { getRecipesListFilters, updateQueryString } from '@/lib/utils';
import { clsx } from 'clsx';
import Link from 'next/link';

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const filters = await getRecipesListFilters(searchParams);
  const viewMode: RecipesListViewMode = (await searchParams).view === 'table' ? 'table' : 'grid';

  return (
    <>
      <header className="prose">
        <h1>Recettes</h1>
      </header>

      <Link
        href={`?${await updateQueryString(searchParams, { view: viewMode === 'grid' ? 'table' : 'grid' })}`}
        className="block my-4"
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
