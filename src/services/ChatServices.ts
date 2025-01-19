//Importações
import { prisma } from "../connection/prisma";

//Services

//Class
export class ChatServices {
    //Listar as últimas conversas do usuário (Listar todas em ordem decrescente)
    async getListAllChats(userId: string) {
        const allChats = await prisma.chat.findMany({
            where: {
                OR: [
                    { receiverId: userId },
                    { senderId: userId }
                ]
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        return allChats;
    };

    //Listar as mensagens de um conversa
    async getListChat(userId: string, chatId: string) {
        const findChat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                messages: true,
            }
        });

        if (findChat && findChat.senderId !== userId && findChat?.receiverId !== userId) {
            return { success: false, error: "User not participant of chat" };
        }

        return { success: true, data: findChat };
    };

    //Criar um bate-papo
    async createChat(senderId: string, receiverId: string) {
        try {
            const hasChatWhitUsers = await this.verifyHasChatWithUsers(senderId, receiverId);
            if (hasChatWhitUsers) return { success: false, error: "Users has a chat existing" };

            const newChat = await prisma.chat.create({
                data: {
                    senderId,
                    receiverId
                }
            });

            return {success: true, data: newChat};
        } catch (error) {
            console.error("Error in creating chat: ", error);
            return {success: false, error: error}
        }
    };

    //Remover um bate-papo
    async removeChat(userId: string, chatId: string) {
        try {
            const findChat = await this.findChatWithId(chatId);
            if (!findChat) return {success: false, error: "Chat does not exist"};

            if (findChat.senderId !== userId && findChat.receiverId !== userId) 
                return {success: false, error: "User does not present in the chat"};
            
            await prisma.chat.delete({
                where: {
                    id: chatId
                }
            });

            return {success: true, message: "Chat has removed"};
            
        } catch (error) {
            console.error("Error in removing cahat: ", error);
            return {success: false, error: error};
        }
    };

    //Função para verificar se um chat existe
    async findChatWithId (chatId: string) {
        const findChat = await prisma.chat.findUnique({
            where: {
                id: chatId
            }
        });

        return findChat;
    };

    //Função para verificar se já existe um bate-papo entre dois usuários
    private async verifyHasChatWithUsers(senderId: string, receiverId: string) {
        const hasChat = await prisma.chat.findFirst({
            where: {
                AND: [
                    { senderId: senderId },
                    { receiverId: receiverId }
                ]
            }
        })
        return hasChat; // Isso vai retornar o primeiro chat encontrado ou `null` se não houver
    }
}