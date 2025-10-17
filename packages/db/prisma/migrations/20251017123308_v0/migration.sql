/*
  Warnings:

  - You are about to drop the column `CredentailData` on the `Credentials` table. All the data in the column will be lost.
  - You are about to drop the `workflow` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `credentialData` to the `Credentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workflowID` to the `Webhook` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."workflow" DROP CONSTRAINT "workflow_userId_fkey";

-- AlterTable
ALTER TABLE "Credentials" DROP COLUMN "CredentailData",
ADD COLUMN     "credentialData" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Webhook" ADD COLUMN     "workflowID" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."workflow";

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "nodes" JSONB[],
    "edges" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Workflow_userId_idx" ON "Workflow"("userId");

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_workflowID_fkey" FOREIGN KEY ("workflowID") REFERENCES "Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
