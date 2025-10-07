/*
  Warnings:

  - The primary key for the `Credentials` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."Credentials" DROP CONSTRAINT "Credentials_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Credentials_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Credentials_id_seq";
