import fp from 'fastify-plugin';
import cors from '@fastify/cors';

export default fp(async fastify => {
  fastify.register(cors, {
    origin: 'https://move-my-car-client.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Set-Cookie' , 'Access-Control-Allow-Credentials'],
    credentials: true,
  } as cors.FastifyCorsOptions);
});
