//Importações
import { Router } from "express";

//Controllers
import { ChatController } from "../controllers/ChatController";

//Middleware
import { authValidationToken } from "../middleware/authValidationToken";
import { checkingUserExists } from "../middleware/checkingUserExists";
import { checkingChatExists } from "../middleware/checkingChatExisting";

//Configurações
const chatRoutes = Router();
const chatController = new ChatController();

//Routes
chatRoutes.get("/", authValidationToken, checkingUserExists, chatController.getListAllChats.bind(chatController));
chatRoutes.get("/:chatId", checkingChatExists, authValidationToken, checkingUserExists, chatController.getListChat.bind(chatController));
chatRoutes.post("/:receiverId", authValidationToken, checkingUserExists, chatController.createChat.bind(chatController));
chatRoutes.delete("/:chatId", checkingChatExists, authValidationToken, checkingUserExists, chatController.removeChat.bind(chatController));

//Export
export { chatRoutes };