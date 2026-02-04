-- DropForeignKey
ALTER TABLE "public"."Execution" DROP CONSTRAINT "Execution_WokflowID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Form" DROP CONSTRAINT "Form_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Webhook" DROP CONSTRAINT "Webhook_workflowID_fkey";

-- AddForeignKey
ALTER TABLE "public"."Webhook" ADD CONSTRAINT "Webhook_workflowID_fkey" FOREIGN KEY ("workflowID") REFERENCES "public"."Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Execution" ADD CONSTRAINT "Execution_WokflowID_fkey" FOREIGN KEY ("WokflowID") REFERENCES "public"."Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Form" ADD CONSTRAINT "Form_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
