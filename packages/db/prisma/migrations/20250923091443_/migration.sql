/*
  Warnings:

  - The values [RESEND] on the enum `CredentialTypes` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `data` on the `Credentials` table. All the data in the column will be lost.
  - Added the required column `CredentailData` to the `Credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."CredentialTypes_new" AS ENUM ('TELEGRAM', 'EMAIL');
ALTER TABLE "public"."Credentials" ALTER COLUMN "platform" TYPE "public"."CredentialTypes_new" USING ("platform"::text::"public"."CredentialTypes_new");
ALTER TYPE "public"."CredentialTypes" RENAME TO "CredentialTypes_old";
ALTER TYPE "public"."CredentialTypes_new" RENAME TO "CredentialTypes";
DROP TYPE "public"."CredentialTypes_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Credentials" DROP COLUMN "data",
ADD COLUMN     "CredentailData" JSONB NOT NULL;
