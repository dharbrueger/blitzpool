/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Pool` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `PoolType` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Pool" ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Pool_name_key" ON "Pool"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PoolType_name_key" ON "PoolType"("name");
