//Importações
import { prisma } from "../connection/prisma";

//Socket
import { WebSocketManager } from "../sockets/WebSocketsManeger";

//Types
import { createNotificationDTO } from "../types/notificationTypes";
import { RedisClientService } from "./RedisClientService";

//Class
export class NotificationServices {
    private redisService: RedisClientService;

    constructor () {
        this.redisService = new RedisClientService();
    }

    //Listar todas as notificações de um usuário
    async getListAllNotifications (userId: string) {
        const allNotifications = await prisma.notification.findMany({
            where: {receiverId: userId},
            include: {
                sender: true
            }
        });

        return allNotifications;
    };

    //Criar um notificação para um usuário
    async createNotification (notification: createNotificationDTO) {
        try {
            if (notification.receiverId === notification.senderId) {
                return {success: false, error: "Don't is possible create notification of same user"};
            }

            const newNotification = await prisma.notification.create({
                data: {
                    ...notification
                },
                include: {
                    sender: true
                }
            });

            WebSocketManager.emitToUser( newNotification.receiverId, "notification", newNotification);

            const getAlert = await this.redisService.getNotificationForUser(newNotification.receiverId);
            if (getAlert !== true){
                WebSocketManager.emitToUser( newNotification.receiverId, "notificationAlert", true);
                await this.redisService.createAlertNotificationForUser(newNotification.receiverId, true);
            }

            return {success: true, data: newNotification}
        } catch (error) {
            console.error("Error in creating notification: ", error);
            return {success: false, error: error}  
        }
    };
}