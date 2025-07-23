//Importações
import { Server } from "socket.io";
import { RedisClientService } from "../services/RedisClientService";

//Redis Server
const redis = new RedisClientService();

//Class
class WebSocketManager {
    private static io: Server;

    // Inicializa o WebSocket
    static initialize(ioInstance: Server) {
        this.io = ioInstance;
    }

    // Emite um evento global
    static emit(event: string, data: any) {
        if (!this.io) {
            throw new Error("WebSocketManager não foi inicializado.");
        }
        this.io.emit(event, data);
    }

    // Emitindo evento para um usuário específico (responsável pela publicação)
    static async emitToUser(userId: string, event: string, data: any) {
        if (!this.io) {
            throw new Error("WebSocketManager não foi inicializado.");
        } else {
            const socketId = await redis.getUserConnected(userId);
            console.log("Dados retornadoos do redis:", socketId);
            
            if (socketId) {
                this.io.to(socketId).emit(event, data); // Emitir evento para o socket do responsável pela publicação
            }
        }
    }
}

export { WebSocketManager };
