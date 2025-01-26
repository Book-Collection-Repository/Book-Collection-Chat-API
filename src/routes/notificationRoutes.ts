//Importações
import { Router } from "express";

//Controllers
import { NotificationController } from "../controllers/NotificationController";

//Middleware
import { authValidationToken } from "../middleware/authValidationToken";
import { checkingUserExists } from "../middleware/checkingUserExists";

//Configurações
const notificationRoutes = Router();
const notificationController = new NotificationController();

//Rotas
notificationRoutes.get("/", authValidationToken, checkingUserExists, notificationController.getListAllNotifications.bind(notificationController));
notificationRoutes.post("/", notificationController.createNotification.bind(notificationController));

//Export
export { notificationRoutes };