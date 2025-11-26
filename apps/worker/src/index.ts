import { redisClient } from "./redis/myredis";
import { execute } from "./execution";

async function main() {
  while (true) {
    const data = await redisClient.BRPOP("workflow", 0);

    const obj = JSON.parse(data?.element as string);
    // console.log(Object.keys(obj)[0]);
    if (Object.keys(obj)[0] == "workflowid") {
      // console.log(obj.workflowid.value);
    }
    // const workflow = await prisma.workflow.findFirst({
    //   where: {
    //     id: obj.workflowid.value,
    //   },
    // });

    execute(obj.workflowid.value);
  }
}

main();
