import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'NsAdSWpmjeUaDfCsENh4xM87PfEqpUMu',
    socket: {
        host: 'redis-16859.c11.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 16859
    }
});

client.on('error', (err) => {
    console.error('Redis Client Error', err);
});

const connectRedis = async () => {
    if (!client.isOpen) {
        await client.connect();
    }
};

export { client, connectRedis };



