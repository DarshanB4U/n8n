import { createClient, RedisClientType } from "redis";

const redisClient: RedisClientType = createClient();

(async () => {
  try {
    await redisClient.connect();
    console.log("bacnked redis connected");
  } catch (error) {
    console.log("error while connecting redis in backend ");
  }
})();

export { redisClient };

