//Importações
import { redis } from "../connection/redisClient";

//Class
export class RedisClientService {
    private readonly userKeyPrefix = "user:"; // Chave para userId -> socketId
    private readonly socketKeyPrefix = "socket:"; // Chave para socketId -> userId

    // Salvar usuário conectado
    async saveUserConnected(socketId: string, userId: string): Promise<void> {
        const userKey = `${this.userKeyPrefix}${userId}`;
        const socketKey = `${this.socketKeyPrefix}${socketId}`;

        await redis.set(userKey, socketId);
        await redis.set(socketKey, userId);
        console.log("Dados salvos no Redis");
    }

    // Obter socketId por userId
    async getUserConnected(userId: string): Promise<string | null> {
        console.log("UserId: ", userId);
        const userKey = `${this.userKeyPrefix}${userId}`;
        return await redis.get(userKey);
    }

    // Obter userId por socketId
    async getUserBySocketId(socketId: string): Promise<string | null> {
        const socketKey = `${this.socketKeyPrefix}${socketId}`;
        return await redis.get(socketKey);
    }

    // Remover usuário conectado
    async deleUserConnected(userId: string): Promise<void> {
        const userKey = `${this.userKeyPrefix}${userId}`;
        const socketId = await this.getUserConnected(userId);

        if (socketId) {
            const socketKey = `${this.socketKeyPrefix}${socketId}`;
            await redis.del(socketKey); // Remover socketId -> userId
        }
        await redis.del(userKey); // Remover userId -> socketId
    }
}
