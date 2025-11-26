import { createClient, RedisClientType } from "redis";

const redisClient: RedisClientType = createClient();

(async () => {
  try {
    await redisClient.connect();
    console.log("redis connected to backend");
  } catch (error) {
    console.log("error while connecting redis in backend ");
  }
})();

export { redisClient };

