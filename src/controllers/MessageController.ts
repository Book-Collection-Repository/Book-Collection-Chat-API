// Importações
import { Request, Response } from "express";
import { validate } from "uuid";
import { ZodError } from "zod";

//Service
import { MessageService } from "../services/MessageService";
import { UserService } from "../services/UserService";

//Validações
import { createMessageSchema } from "../validators/messageValidator";

// Redis
import { redis } from "../connection/redisClient";

//Utils
import { handleZodError } from "../utils/errorHandler";
import { WebSocketManager } from "../sockets/WebSocketsManeger";
import { ChatServices } from "../services/ChatServices";
import { NotificationServices } from "../services/NotifcationService";
import { RedisClientService } from "../services/RedisClientService";

//Class
export class MessageController {

    private messageService: MessageService;
    private chatService: ChatServices;
    private notificationService: NotificationServices;
    private redisServices: RedisClientService;

    constructor() {
        this.messageService = new MessageService();
        this.chatService = new ChatServices();
        this.notificationService = new NotificationServices();
        this.redisServices = new RedisClientService();
    };

    //Método para listar as mensagens de um conversa
    async findChatsRecents(req: Request, res: Response): Promise<Response> {
        try {
            const chatId = req.params.chatId;

            //Validando que o chat não seja inválido
            if (!chatId || chatId === null || chatId === undefined) return res.status(400).json({ error: "Id of chat not found" });

            const allMessages = await this.messageService.getMessageOfChat(chatId);

            return res.status(200).json({ allMessages: allMessages });

        } catch (error) {
            console.error("Error return message: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para criar e enviar mensagens
    async createMessages(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const { content } = createMessageSchema.parse(req.body);
            const chatId = req.params.chatId;

            //Validando que o chat não seja inválido
            if (!chatId || chatId === null || chatId === undefined) return res.status(400).json({ error: "Id of chat not found" });
            
            const findChat = await this.chatService.findChatWithId(chatId);
            if (!findChat) return res.status(404).json({error: "Chta not found"});

            //Criando mensagem
            const message = await this.messageService.createMessageForUser({ content, chatId, senderId: idUser });
            if (!message.success) return res.status(message.status).json({ error: message.message });

            //Emitindo notificaçãio para o usuário
            WebSocketManager.emitToUser(idUser, "createMessage", { message: message.message });
            if (idUser === findChat.receiverId) {
                WebSocketManager.emitToUser(findChat.senderId, "receiverMessage", { message: message.message });
            
                await this.notificationService.createNotification({
                    action:"SEE_CHAT",
                    content:"Send message for you",
                    receiverId:findChat.senderId,
                    publicationId:undefined,
                    senderId:idUser,
                    chatId: findChat.id,
                });
                
            } else if (idUser === findChat.senderId) {
                WebSocketManager.emitToUser(findChat.receiverId, "receiverMessage", { message: message.message });
                
                await this.notificationService.createNotification({
                    action:"SEE_CHAT",
                    content:"Send message for you",
                    receiverId:findChat.receiverId,
                    publicationId:undefined,
                    senderId:idUser,
                    chatId: findChat.id,
                });
            }


            //Criando alerta
            const findAlerts = await this.redisServices.getNotificationNewMessages(idUser);
            const alerts = findAlerts ? [...findAlerts, { chatId: findChat.id }] : [{ chatId: findChat.id }];
            await this.redisServices.salvedNotificationNewMessages(idUser, alerts); 

            return res.status(message.status).json({ message: "Create message", contentMessage: message.message });

        } catch (error) {
            // Verificar se o erro é de validação do Zod
            if (error instanceof ZodError) {
                return handleZodError(error, res); // Usando a função de tratamento de erros
            }
            console.error("Error return message: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para deletar mensagens
    async removeMessages(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const idMessage = req.params.idMessage;

            if (!validate(idMessage)) return res.status(400).json({ error: "Invalida ID format" });

            //Valdiando que o usuário é o responsável pela mensagem
            const userIsCreatorTheMessage = await this.messageService.verifyUserCreatorMessage(idUser, idMessage);
            if (!userIsCreatorTheMessage.sucess) return res.status(userIsCreatorTheMessage.status).json({ error: userIsCreatorTheMessage.message });

            //Deletando mensagem
            const removedMessage = await this.messageService.removeMessageForUser(idMessage);

            return res.status(200).json({ message: removedMessage });

        } catch (error) {
            console.error("Error return message: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
}