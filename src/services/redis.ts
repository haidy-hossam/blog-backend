import { createClient } from 'redis';

const client = createClient({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT!,
  },
}).on('error', (error) => console.log('Redis Client Error', error)); // eslint-disable-line

await client.connect();

export default client;
