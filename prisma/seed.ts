import { faker } from '@faker-js/faker';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();
async function main() {
  const existingRecipeNames = (await prisma.recipe.findMany({ select: { name: true } })).map(
    (r) => r.name,
  );

  const recipeNames =
    existingRecipeNames.length > 0
      ? existingRecipeNames
      : faker.helpers.uniqueArray(faker.food.dish, 10);

  for (const recipeName of recipeNames) {
    await prisma.recipe.upsert({
      where: { name: recipeName },
      update: {},
      create: {
        name: recipeName,
        content: faker.lorem.paragraphs(faker.helpers.rangeToNumber({ min: 1, max: 3 })),
        persons: faker.helpers.rangeToNumber({ min: 2, max: 6 }),
        timePrep: faker.helpers.rangeToNumber({ min: 5, max: 15 }),
        timeCook: faker.helpers.rangeToNumber({ min: 10, max: 90 }),
        ingredients: {
          create: faker.helpers.uniqueArray(
            () => ({
              name: faker.food.ingredient(),
              unit: faker.helpers.arrayElement(['', 'g', 'ml']),
              amount: faker.helpers.rangeToNumber({ min: 5, max: 150 }),
            }),
            faker.helpers.rangeToNumber({ min: 2, max: 6 }),
          ),
        },
      },
    });
  }

  // Filterable ingredients
  for (const name of ['Pomme de terre', 'Oranges', 'Haricot vert'])
    await prisma.filterableIngredient.upsert({
      where: { name },
      update: {},
      create: {
        name,
      },
    });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
