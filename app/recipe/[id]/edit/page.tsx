import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import IconBack from 'bootstrap-icons/icons/arrow-left-short.svg';
import { RecipeForm } from '@/app/recipe/[id]/edit/form';

type RecipeEditPageParams = { id: string };

export default async function RecipeEditPage({
  params,
}: {
  params: Promise<RecipeEditPageParams>;
}) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { id }, include: { ingredients: true } });

  if (!recipe) {
    notFound();
  }

  return (
    <div className="flex flex-col items-stretch">
      <nav className="flex items-center justify-between mb-3">
        <Link href={`/recipe/${id}`} className="btn btn-square" aria-label="Retour à la recette">
          <IconBack transform="scale(1.5,1.5)" />
        </Link>
      </nav>
      <RecipeForm recipe={recipe} />
    </div>
  );
}
