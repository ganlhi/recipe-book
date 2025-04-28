'use server';

import { Ingredient, Recipe } from '@/app/generated/prisma';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function updateRecipe(recipe: Recipe & { ingredients: Ingredient[] }) {
  await prisma.recipe.update({
    where: { id: recipe.id },
    include: { ingredients: true },
    data: {
      name: recipe.name,
      content: recipe.content,
      persons: recipe.persons,
      timeCook: recipe.timeCook,
      timePrep: recipe.timePrep,
      ingredients: {
        createMany: {
          data: recipe.ingredients.filter((i) => !i.id),
        },
      },
    },
  });

  for (const ingredient of recipe.ingredients.filter((i) => !!i.id)) {
    await prisma.ingredient.update({ where: { id: ingredient.id }, data: ingredient });
  }

  redirect(`/recipe/${recipe.id}`);
}
