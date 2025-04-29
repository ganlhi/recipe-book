/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "FilterableIngredient" (
    "name" TEXT NOT NULL,

    CONSTRAINT "FilterableIngredient_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_name_key" ON "Recipe"("name");
