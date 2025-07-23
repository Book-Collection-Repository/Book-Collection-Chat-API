//Importações
import { Router } from "express";

//Controllers
import { RedisClientController } from "../controllers/RedisClienteController";

//Middleware
import { authValidationToken } from "../middleware/authValidationToken";
import { checkingUserExists } from "../middleware/checkingUserExists";

//Configurações
const redisRoute = Router();
const redisController = new RedisClientController();

//Rotas
redisRoute.get("/users/online", redisController.getListAllUserOline.bind(redisController));
redisRoute.get("/alert/notification", authValidationToken, checkingUserExists, redisController.getListHasNotificationAlert.bind(redisController));
redisRoute.post("/alert/notification", authValidationToken, checkingUserExists, redisController.salvedHasNotification.bind(redisController));
redisRoute.get("/alert/newMessage", authValidationToken, checkingUserExists, redisController.getListHasNotificationNewMessages.bind(redisController));
redisRoute.post("/alert/newMessage", authValidationToken, checkingUserExists, redisController.salvedHasNotificationForNewMessage.bind(redisController));

//Exportando
export { redisRoute };