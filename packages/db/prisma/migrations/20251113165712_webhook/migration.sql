/*
  Warnings:

  - You are about to drop the column `header` on the `Webhook` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Webhook` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Webhook" DROP COLUMN "header",
DROP COLUMN "title";
