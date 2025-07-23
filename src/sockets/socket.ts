//Importaões
import { Server } from "socket.io";
import { RedisClientService } from "../services/RedisClientService";

//Configurando o redis
const redis = new RedisClientService();

export default function configureSocket(io: Server) {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("register", async (user) => {
            console.log(`User registered: ${user}`);

            // Salva no Redis
            await redis.saveUserConnected(socket.id, user);

            const users = await redis.getAllConnectedUsers();
            io.emit("online-users", users);
        });

        socket.on("writtingMessage", async (data: { userId: string; message: boolean }) => {
            io.to(data.userId).emit("userWrittingMessage", data.message);
        });

        socket.on("disconnect", async () => {
            console.log(`User disconnected: ${socket.id}`);

            // Remover o usuário desconectado do Redis
            const userId = await redis.getUserBySocketId(socket.id);
            if (userId) {
                await redis.deleUserConnected(userId);
                console.log(`Removed user: ${userId} from Redis`);
            }
            const users = await redis.getAllConnectedUsers();
            io.emit("online-users", users);
        });
    });
}

