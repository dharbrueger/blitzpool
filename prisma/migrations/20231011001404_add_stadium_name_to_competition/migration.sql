/*
  Warnings:

  - Added the required column `stadium` to the `Competition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "stadium" TEXT NOT NULL;
