//Importações
import { Router } from "express";

//Rotas
import { messageRoutes } from "./messageRoutes";
import { chatRoutes } from "./chatRoutes";
import { notificationRoutes } from "./notificationRoutes";
import { redisRoute } from "./redisRoutes";

//Configurações
const routes = Router();

routes.use("/message", messageRoutes);
routes.use("/chat", chatRoutes);
routes.use("/notification", notificationRoutes);
routes.use("/redis", redisRoute);

export {routes};