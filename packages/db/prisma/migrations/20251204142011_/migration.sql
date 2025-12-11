/*
  Warnings:

  - You are about to drop the column `WofklowID` on the `Execution` table. All the data in the column will be lost.
  - You are about to drop the column `nodesExecuted` on the `Execution` table. All the data in the column will be lost.
  - Added the required column `WokflowID` to the `Execution` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Execution" DROP CONSTRAINT "Execution_WofklowID_fkey";

-- DropIndex
DROP INDEX "public"."Execution_WofklowID_idx";

-- AlterTable
ALTER TABLE "public"."Execution" DROP COLUMN "WofklowID",
DROP COLUMN "nodesExecuted",
ADD COLUMN     "WokflowID" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."NodeExecutionStatus";

-- CreateIndex
CREATE INDEX "Execution_WokflowID_idx" ON "public"."Execution"("WokflowID");

-- AddForeignKey
ALTER TABLE "public"."Execution" ADD CONSTRAINT "Execution_WokflowID_fkey" FOREIGN KEY ("WokflowID") REFERENCES "public"."Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
