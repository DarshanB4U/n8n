import { redisClient } from "./redis/myredis";
import { RunWorkflow } from "./execution";

async function main() {
  while (true) {
    const data = await redisClient.BRPOP("workflow", 0);

    const obj = JSON.parse(data?.element as string);
    console.log(obj);
    console.log(obj.formExecutionId,obj.workflowId);
    RunWorkflow(obj.workflowId, obj.formExecutionId);
  }
}

main();
