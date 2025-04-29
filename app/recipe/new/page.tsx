import Link from 'next/link';
import IconBack from 'bootstrap-icons/icons/arrow-left-short.svg';
import { RecipeForm } from '@/app/recipe/form';

export const dynamic = 'force-dynamic';

export default async function RecipeCreatePage() {
  return (
    <div className="flex flex-col items-stretch">
      <nav className="flex items-center justify-between mb-3">
        <Link href="/" className="btn btn-square" aria-label="Retour à la liste des recettes">
          <IconBack transform="scale(1.5,1.5)" />
        </Link>
      </nav>
      <RecipeForm />
    </div>
  );
}
