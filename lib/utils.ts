import { isRecipesListFilters, RecipesListFilters, SearchParams } from '@/lib/types';

const EMPTY_FILTERS: RecipesListFilters = { name: '', ingredients: [] };

export async function getRecipesListFilters(
  searchParams: Promise<SearchParams>,
): Promise<RecipesListFilters> {
  const sp = await searchParams;
  try {
    if (typeof sp.filters !== 'string') return EMPTY_FILTERS;

    const filters = JSON.parse(decodeURIComponent(sp.filters));
    if (!isRecipesListFilters(filters)) return EMPTY_FILTERS;

    return filters;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return EMPTY_FILTERS;
  }
}

export async function setInSearchParams(
  currentSearchParams: Promise<SearchParams>,
  overrides: SearchParams,
): Promise<SearchParams> {
  return {
    ...(await currentSearchParams),
    ...overrides,
  };
}

export function searchParamsAsString(searchParams: SearchParams): string {
  return Object.entries(searchParams)
    .reduce<string[]>((acc, [k, v]) => {
      if (!v) return acc;

      return [...acc, ...(Array.isArray(v) ? v : [v]).map((vi) => `${k}=${vi}`)];
    }, [])
    .join('&');
}

export async function updateQueryString(
  currentSearchParams: Promise<SearchParams>,
  overrides: SearchParams,
): Promise<string> {
  return searchParamsAsString(await setInSearchParams(currentSearchParams, overrides));
}
