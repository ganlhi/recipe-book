'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { RecipeFormPayload } from '@/lib/types';

export async function updateRecipe(recipe: RecipeFormPayload) {
  if (recipe.id) {
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
  } else {
    const created = await prisma.recipe.create({
      include: { ingredients: true },
      data: {
        name: recipe.name,
        content: recipe.content,
        persons: recipe.persons,
        timeCook: recipe.timeCook,
        timePrep: recipe.timePrep,
        ingredients: {
          createMany: {
            data: recipe.ingredients,
          },
        },
      },
    });

    redirect(`/recipe/${created.id}`);
  }
}

export async function deleteRecipe(recipeId: string) {
  await prisma.recipe.delete({ include: { ingredients: true }, where: { id: recipeId } });
}

export async function toggleFilterableIngredient(ingredient: string) {
  const existing = await prisma.filterableIngredient.count({ where: { name: ingredient } });
  if (existing > 0) {
    await prisma.filterableIngredient.delete({ where: { name: ingredient } });
  } else {
    await prisma.filterableIngredient.create({ data: { name: ingredient } });
  }
}
