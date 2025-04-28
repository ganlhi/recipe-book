import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';
import IconBack from 'bootstrap-icons/icons/arrow-left-short.svg';
import IconPencil from 'bootstrap-icons/icons/pencil.svg';
import IconPlus from 'bootstrap-icons/icons/plus.svg';
import IconMinus from 'bootstrap-icons/icons/dash.svg';
import { SignedIn } from '@clerk/nextjs';
import { SearchParams } from '@/lib/types';
import { getFromSearchParams, updateQueryString } from '@/lib/utils';

type RecipePageParams = { id: string };

export default async function RecipePage({
  params,
  searchParams,
}: {
  params: Promise<RecipePageParams>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { id }, include: { ingredients: true } });

  if (!recipe) {
    notFound();
  }

  const nbPersons = getFromSearchParams(await searchParams, 'persons', recipe.persons);
  const quantitiesMult = nbPersons / recipe.persons;

  const content = await remark().use(html).process(recipe.content);

  return (
    <div className="flex flex-col items-stretch">
      <nav className="flex items-center justify-between mb-3">
        <Link href="/" className="btn btn-square" aria-label="Retour à la liste">
          <IconBack transform="scale(1.5,1.5)" />
        </Link>

        <SignedIn>
          <Link href={`/recipe/${id}/edit`} className="btn">
            <IconPencil /> Modifier
          </Link>
        </SignedIn>
      </nav>
      <article className="prose m-auto max-w-2xl">
        <h1 className="">{recipe.name}</h1>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Temps de préparation</div>
            <div className="stat-value text-xl">{recipe.timePrep} minutes</div>
          </div>
          <div className="stat">
            <div className="stat-title">Temps de cuisson</div>
            <div className="stat-value text-xl">{recipe.timeCook} minutes</div>
          </div>
          <div className="stat">
            <div className="stat-title">Portions</div>
            <div className="stat-value text-xl">
              <span className="flex gap-1 items-center">
                <Link
                  className="btn btn-square btn-xs "
                  aria-label="Diminuer le nombre de personnes"
                  href={`?${updateQueryString(await searchParams, { persons: String(Math.max(1, nbPersons - 1)) })}`}
                >
                  <IconMinus />
                </Link>
                <span>{nbPersons} personnes</span>
                <Link
                  className="btn btn-square btn-xs "
                  aria-label="Augmenter le nombre de personnes"
                  href={`?${updateQueryString(await searchParams, { persons: String(nbPersons + 1) })}`}
                >
                  <IconPlus />
                </Link>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box shadow w-max">
          <h2 className="p-4 mb-0!">Ingrédients</h2>
          <ul className="list">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.id} className="list-row justify-between flex gap-24">
                <div>{ingredient.name}</div>
                <div>
                  {Number((ingredient.amount * quantitiesMult).toFixed(2))} {ingredient.unit}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <section dangerouslySetInnerHTML={{ __html: content.toString() }} />
      </article>
    </div>
  );
}
