import { isRecipesListFilters, RecipesListFilters, SearchParams } from '@/lib/types';

export const EMPTY_FILTERS: RecipesListFilters = { name: '', ingredients: [] };

export function getRecipesListFilters(searchParams: SearchParams): RecipesListFilters {
  try {
    if (typeof searchParams.filters !== 'string') return EMPTY_FILTERS;

    const filters = JSON.parse(decodeURIComponent(searchParams.filters));
    if (!isRecipesListFilters(filters)) return EMPTY_FILTERS;

    return filters;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return EMPTY_FILTERS;
  }
}

export function getFromSearchParams<T extends string | boolean | number>(
  searchParams: SearchParams,
  key: string,
  defaultValue: T,
): T {
  const fromParams = searchParams[key];
  if (typeof fromParams !== 'string') return defaultValue;

  switch (typeof defaultValue) {
    case 'string':
      return fromParams as T;
    case 'number': {
      const asNumber = Number(fromParams);
      return isNaN(asNumber) ? defaultValue : (asNumber as T);
    }
    case 'boolean': {
      if (fromParams === 'true') return true as T;
      if (fromParams === 'false') return false as T;
      return defaultValue;
    }
  }
  return defaultValue;
}

export function setInSearchParams(
  currentSearchParams: SearchParams,
  overrides: SearchParams,
): SearchParams {
  return {
    ...currentSearchParams,
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

export function updateQueryString(
  currentSearchParams: SearchParams,
  overrides: SearchParams,
): string {
  return searchParamsAsString(setInSearchParams(currentSearchParams, overrides));
}
