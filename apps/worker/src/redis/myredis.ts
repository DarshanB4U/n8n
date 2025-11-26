import { createClient, RedisClientType } from "redis";

const redisClient: RedisClientType = createClient();

(async () => {
  try {
    await redisClient.connect();
    console.log("redis connected to worker ");
  } catch (error) {
    console.log("error while connecting redis to workfwr  ");
  }
})();

export { redisClient };
