import { RecipesListFilters, RecipesListViewMode } from '@/lib/types';
import prisma from '@/lib/prisma';
import IconCaretRightFill from 'bootstrap-icons/icons/caret-right-fill.svg';
import Link from 'next/link';

export async function RecipesList({
  filters,
  viewMode = 'grid',
}: {
  filters: RecipesListFilters;
  viewMode?: RecipesListViewMode;
}) {
  const recipes = await prisma.recipe.findMany({
    include: { ingredients: true },
    where: {
      name: filters.name
        ? {
            contains: filters.name,
            mode: 'insensitive',
          }
        : undefined,
      ingredients:
        filters.ingredients.length > 0
          ? {
              some: {
                name: { in: filters.ingredients },
              },
            }
          : undefined,
    },
  });

  return viewMode === 'grid' ? (
    <div className="flex flex-wrap gap-4 ">
      {recipes.map((recipe) => (
        <div className="card w-80 bg-base-200 shadow" key={recipe.id}>
          <div className="card-body">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">{recipe.name}</h2>
            </div>
            <ul className="flex-1 mt-2 flex flex-col gap-2 text-xs">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id}>{ingredient.name}</li>
              ))}
            </ul>
            <div className="mt-2 flex justify-between items-center">
              <span>
                Prep. {recipe.timePrep}&apos; / Cuisson {recipe.timeCook}&apos;
              </span>
              <Link
                href={`/recipe/${recipe.id}`}
                aria-label="Voir la recette"
                className="btn btn-sm btn-circle btn-accent"
              >
                <IconCaretRightFill />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="overflow-x-auto ">
      <table className="table">
        <thead>
          <tr>
            <th>Recette</th>
            <th>Préparation</th>
            <th>Cuisson</th>
            <th>Ingrédients</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe.id}>
              <td>
                <Link href={`/recipe/${recipe.id}`} aria-label="Voir la recette" className="link">
                  {recipe.name}
                </Link>
              </td>
              <td>{recipe.timePrep} min.</td>
              <td>{recipe.timeCook} min.</td>
              <td>{recipe.ingredients.map((ingredient) => ingredient.name).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
