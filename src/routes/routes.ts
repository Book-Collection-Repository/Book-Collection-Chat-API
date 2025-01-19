//Importações
import { Router } from "express";

//Rotas
import { messageRoutes } from "./messageRoutes";
import { publicationRoutes } from "./publicationRoutes";
import { chatRoutes } from "./chatRoutes";
import { notificationRoutes } from "./notificationRoutes";

//Configurações
const routes = Router();

routes.use("/message", messageRoutes);
routes.use("/publication", publicationRoutes);
routes.use("/chat", chatRoutes);
routes.use("/notification", notificationRoutes);

export {routes};