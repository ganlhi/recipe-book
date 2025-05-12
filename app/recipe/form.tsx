'use client';

import { Ingredient } from '@/app/generated/prisma';
import { useState } from 'react';
import IconPlus from 'bootstrap-icons/icons/plus.svg';
import { updateRecipe } from '@/app/actions';
import { RecipeFormPayload } from '@/lib/types';

const EMPTY_RECIPE: RecipeFormPayload = {
  name: '',
  content: '',
  ingredients: [],
  persons: 1,
  timeCook: 0,
  timePrep: 0,
  source: '',
};

function isValid(value: RecipeFormPayload) {
  return (
    !!value.name &&
    value.persons >= 1 &&
    value.timePrep >= 0 &&
    value.timeCook >= 0 &&
    value.ingredients.every((i) => !!i.name)
  );
}

export function RecipeForm({ recipe }: { recipe?: RecipeFormPayload }) {
  const [value, setValue] = useState(recipe ?? EMPTY_RECIPE);

  return (
    <form
      className="m-auto w-2xl flex flex-col gap-3 items-stretch"
      action={() => updateRecipe(value)}
    >
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Nom de la recette</legend>
        <input
          className="input w-full"
          type="text"
          name="name"
          required
          value={value.name}
          onChange={(e) => setValue((v) => ({ ...v, name: e.target.value }))}
        />
      </fieldset>

      <div className="grid grid-cols-3 gap-3">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Temps de préparation</legend>
          <input
            className="input w-full"
            type="number"
            min={0}
            step={1}
            name="timePrep"
            value={value.timePrep}
            onChange={(e) => setValue((v) => ({ ...v, timePrep: e.target.valueAsNumber }))}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Temps de cuisson</legend>
          <input
            className="input w-full"
            type="number"
            min={0}
            step={1}
            name="timeCook"
            value={value.timeCook}
            onChange={(e) => setValue((v) => ({ ...v, timeCook: e.target.valueAsNumber }))}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Nombre de personnes</legend>
          <input
            className="input w-full"
            type="number"
            min={1}
            step={1}
            name="persons"
            value={value.persons}
            onChange={(e) => setValue((v) => ({ ...v, persons: e.target.valueAsNumber }))}
          />
        </fieldset>
      </div>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Ingrédients</legend>
        <div className="flex flex-col gap-2">
          {value.ingredients.map((ingredient, index) => (
            <div className="flex gap-2" key={index}>
              <input
                type="text"
                className="input flex-1"
                placeholder="Ingrédient"
                name={`ingredient-${index}-name`}
                value={ingredient.name}
                onChange={(e) => {
                  const newIngredients = value.ingredients.map((ing, ind) => {
                    if (ind !== index) return ing;
                    return { ...ing, name: e.target.value };
                  });
                  setValue({ ...value, ingredients: newIngredients });
                }}
              />
              <div className="join">
                <input
                  type="number"
                  className="join-item input w-20"
                  placeholder="Quantité"
                  name={`ingredient-${index}-amount`}
                  value={ingredient.amount}
                  onChange={(e) => {
                    const newIngredients = value.ingredients.map((ing, ind) => {
                      if (ind !== index) return ing;
                      return {
                        ...ing,
                        amount: isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
                      };
                    });
                    setValue({ ...value, ingredients: newIngredients });
                  }}
                />
                <input
                  type="text"
                  className="join-item input w-30"
                  placeholder="Unité"
                  name={`ingredient-${index}-unit`}
                  value={ingredient.unit}
                  onChange={(e) => {
                    const newIngredients = value.ingredients.map((ing, ind) => {
                      if (ind !== index) return ing;
                      return { ...ing, unit: e.target.value };
                    });
                    setValue({ ...value, ingredients: newIngredients });
                  }}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm btn-square"
            onClick={() => {
              setValue((v) => ({
                ...v,
                ingredients: [...v.ingredients, { name: '', amount: 0, unit: '' } as Ingredient],
              }));
            }}
          >
            <IconPlus />
          </button>
        </div>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Déroulement</legend>
        <textarea
          className="textarea h-90 w-full"
          name="content"
          value={value.content}
          onChange={(e) => setValue((v) => ({ ...v, content: e.target.value }))}
        ></textarea>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Source</legend>
        <input
          className="input w-full"
          type="text"
          name="source"
          value={value.source}
          onChange={(e) => setValue((v) => ({ ...v, source: e.target.value }))}
        />
      </fieldset>

      <button className="btn self-end" type="submit" disabled={!isValid(value)}>
        Enregistrer les modifications
      </button>
    </form>
  );
}
