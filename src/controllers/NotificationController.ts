//Importações
import { Request, Response } from "express";

//Services
import { NotificationServices } from "../services/NotifcationService";

//Types
import { createNotificationDTO } from "../types/notificationTypes";

//Criando controllers
export class NotificationController {
    private notificationService: NotificationServices;

    constructor() {
        this.notificationService = new NotificationServices();
    }

    //Requisição para listar todas as notificações de um usuário
    async getListAllNotifications (req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;
            
            //Buscando notificações
            const notifications = await this.notificationService.getListAllNotifications(idUser);

            return res.status(200).json({data: notifications});
        } catch (error) {
            console.error("Erro in listing all notifications of user: ", error);
            return res.status(500).json({error: error});
        }
    };

    //Requisição para criar uma notificação
    async createNotification (req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User; //Id do usuário que cria a notificação
            const data: createNotificationDTO = req.body.notification;

            //Buscando dados 
            const createNotification = await this.notificationService.createNotification(data);
            if (!createNotification.success) return res.status(400).json({error: createNotification.error});

            return res.status(201).json({data: createNotification.data});
        } catch (error) {
            console.error("Erro in listing all notifications of user: ", error);
            return res.status(500).json({error: error});
        }
    };
}