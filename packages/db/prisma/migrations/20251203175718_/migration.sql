/*
  Warnings:

  - You are about to drop the column `triggerData` on the `Execution` table. All the data in the column will be lost.
  - You are about to drop the `NodeExecution` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nodeId` to the `Execution` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."NodeExecution" DROP CONSTRAINT "NodeExecution_executionId_fkey";

-- AlterTable
ALTER TABLE "public"."Execution" DROP COLUMN "triggerData",
ADD COLUMN     "nodeId" TEXT NOT NULL,
ADD COLUMN     "nodeOutput" JSONB[];

-- DropTable
DROP TABLE "public"."NodeExecution";
