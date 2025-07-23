//Importações
import { Request, Response, NextFunction } from "express";
import { validate } from "uuid";

//Services
import { ChatServices } from "../services/ChatServices";

//Middleware
export async function checkingChatExists(req: Request, res: Response, next: NextFunction) {
    const chatServices = new ChatServices();
    const idChat = req.params.chatId;

    try {
        //Validando que o chat não seja inválido
        if (!idChat || idChat === null || idChat === undefined) return res.status(400).json({ error: "Id of chat not found" });

        // Validando que o ID é um UUID válido
        if (!validate(idChat)) return res.status(400).json({ message: "Invalid format ID" });

        const findChat = await chatServices.findChatWithId(idChat);
        if (!findChat) return res.status(404).json({message: "Chat not found"});

        next();

    } catch (error) {
        console.error("Error checking chat existing:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}