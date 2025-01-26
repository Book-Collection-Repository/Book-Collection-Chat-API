//Importações
import { redis } from "../connection/redisClient";

//Class
export class RedisClientService {
    private readonly userKeyPrefix = "user:"; // Chave para userId -> socketId
    private readonly socketKeyPrefix = "socket:"; // Chave para socketId -> userId
    private readonly notificationKeyPrefix = "notification:";
    private readonly notificationChatKeyPrefix = "notification-chat:";
    private readonly expirationTime: number = 172800; // Dois dias em segundos

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

    // Recuperar todos os usuários conectados
    async getAllConnectedUsers(): Promise<{ userId: string; socketId: string | null }[]> {
        const keys = await redis.keys(`${this.userKeyPrefix}*`); // Pega todas as chaves de usuários
        const users = await Promise.all(
            keys.map(async (key) => {
                const userId = key.replace(this.userKeyPrefix, ""); // Extrai o userId
                const socketId = await redis.get(key); // Obtém o socketId pelo userKey
                return { userId, socketId };
            })
        );
        return users.filter((user) => user.socketId); // Remove usuários sem socketId
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

    //Adicionar uma notificação
    async createAlertNotificationForUser(userId:string, data:boolean): Promise<void> {
        const notificationKey = `${this.notificationKeyPrefix}${userId}`;
        await redis.set(notificationKey, JSON.stringify(data), 'EX', this.expirationTime);
    }

    //Listar a notificação de usuário
    async getNotificationForUser(userId: string): Promise<boolean | null> {
        const notificationKey = `${this.notificationKeyPrefix}${userId}`;
        const notification = await redis.get(notificationKey);
    
        if (notification !== null) {
            try {
                return JSON.parse(notification) as boolean;
            } catch (error) {
                console.error(`Failed to parse notification for user ${userId}:`, error);
                return null;
            }
        }
    
        return null; // Retorna null se não houver notificação armazenada
    }

    //Método para salvar os alertas de mensagens
    async salvedNotificationNewMessages(userId: string, data: any[]): Promise<any | null> {
        const notificationKey = `${this.notificationChatKeyPrefix}${userId}`;
        await redis.set(notificationKey, JSON.stringify(data), 'EX', this.expirationTime);
    }

    async getNotificationNewMessages(userId: string) : Promise<any[] | null> {
        const notificationKey = `${this.notificationChatKeyPrefix}${userId}`;
        const allNotificationMessage = await redis.get(notificationKey);
        return allNotificationMessage ? JSON.parse(allNotificationMessage) : null;
    };
}
