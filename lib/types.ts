import { Ingredient, Recipe } from '@/app/generated/prisma';

export type SearchParams = { [key: string]: string | string[] | undefined };

export type RecipesListFilters = { name: string; ingredients: string[] };
export function isRecipesListFilters(o: unknown): o is RecipesListFilters {
  return (
    typeof o === 'object' &&
    o !== null &&
    'name' in o &&
    typeof o.name === 'string' &&
    'ingredients' in o &&
    Array.isArray(o.ingredients)
  );
}

export type RecipesListViewMode = 'table' | 'grid';

export type RecipeFormPayload = Pick<
  Recipe,
  'timePrep' | 'timeCook' | 'persons' | 'content' | 'name' | 'source'
> & {
  id?: Recipe['id'];
  ingredients: Array<Pick<Ingredient, 'name' | 'amount' | 'unit'> & { id?: Ingredient['id'] }>;
};
