//Importações
import { Request, Response } from "express";

//Services
import { ChatServices } from "../services/ChatServices";
import { WebSocketManager } from "../sockets/WebSocketsManeger";

//Class
export class ChatController {
    private chatServices: ChatServices;

    constructor () {
        this.chatServices = new ChatServices();
    }

    //Requisição para listar as últimas conversas do usuário
    async getListAllChats (req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;
            
            //Buscando coonversas
            const chats = await this.chatServices.getListAllChats(idUser);

            return res.status(200).json({data: chats});
        } catch (error) {
            console.error("Erro in listing all chats of user: ", error);
            return res.status(500).json({error: error});
        }
    };

    //Requisição para listar uma conversa de um usuário
    async getListChat(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;
            const chatId = req.params.chatId;

            //Validando que o chat não seja inválido
            if (!chatId || chatId === null || chatId === undefined) return res.status(400).json({error: "Id of chat not found"});

            //Buscando coonversas
            const chats = await this.chatServices.getListChat(idUser, chatId);
            if (!chats.success) return res.status(400).json({error: chats.error});

            return res.status(200).json({data: chats});
        } catch (error) {
            console.error("Erro in listing chat of user: ", error);
            return res.status(500).json({error: error});
        }
    };

    //Requisição para criar uma conversa
    async createChat(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;
            const receiverId = req.params.receiverId;

            //Validando que o usuário não seja inválido
            if (!receiverId || receiverId === null || receiverId === undefined) return res.status(400).json({error: "Id of chat not found"});

            //Buscando coonversas
            const chats = await this.chatServices.createChat(idUser, receiverId);
            if (!chats.success) return res.status(400).json({error: chats.error});

            //Notificando os usuários
            await WebSocketManager.emitToUser(receiverId, "createChat", {data: chats});

            return res.status(201).json({data: chats});
        } catch (error) {
            console.error("Erro in creating chats of user: ", error);
            return res.status(500).json({error: error});
        }
    };

    //Requisição para remover uma conversa
    async removeChat(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;
            const chatId = req.params.chatId;

            //Validando que o chat não seja inválido
            if (!chatId || chatId === null || chatId === undefined) return res.status(400).json({error: "Id of chat not found"});

            //Buscando o chat para ver se ele existe
            const findChat = await this.chatServices.getListChat(idUser, chatId);
            if (!findChat.success || !findChat.data) return res.status(404).json({message: "Message not found", error: findChat.error});

            //Buscando coonversas
            const chats = await this.chatServices.removeChat(idUser, chatId);
            if (!chats.success) return res.status(400).json({error: chats.error});

            if (findChat.data.receiverId === idUser) {
                await WebSocketManager.emitToUser(findChat.data.senderId, "removeChat", {data: chatId});
            } else {
                await WebSocketManager.emitToUser(findChat.data.receiverId, "removeChat", {data: chatId});
            }

            return res.status(200).json({message: "Chat removed"});
        } catch (error) {
            console.error("Erro in listing all chats of user: ", error);
            return res.status(500).json({error: error});
        }
    };
}