//Importações
import { Request, response, Response } from "express";

//Services
import { RedisClientService } from "../services/RedisClientService";
import { boolean } from "zod";

//Class
export class RedisClientController {
    private redisClientService: RedisClientService;

    constructor () {
        this.redisClientService = new RedisClientService();
    }

    //Listar todos os usuários online
    async getListAllUserOline (req: Request, res: Response): Promise<Response> {
        try {
            const data = await this.redisClientService.getAllConnectedUsers();
            
            return res.status(200).json({users: data});
        } catch (error) {
            console.error("Error in get list of users connected: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Há notificações?
    //Salvar
    async salvedHasNotification(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const result:boolean = req.body.data;

            if(result === null || result === undefined) return res.status(400).json({error: "Data not informed"});

            await this.redisClientService.createAlertNotificationForUser(idUser, result);
            
            return res.status(200).json({message: "Date of alert of notifications salved"});
        } catch (error) {
            console.error("Error in alert of notification: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }; 

    //Listar
    async getListHasNotificationAlert(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const data = await this.redisClientService.getNotificationForUser(idUser);
            
            return res.status(200).json({result: data});
        } catch (error) {
            console.error("Error in get list of users connected: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Novas mensagens?
    //Salvar
    async salvedHasNotificationForNewMessage(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const result = req.body.data;

            if(result === null || result === undefined) return res.status(400).json({error: "Data not informed"});

            await this.redisClientService.salvedNotificationNewMessages(idUser, result);
            
            return res.status(200).json({message: "Date of alert of notifications salved"});
        } catch (error) {
            console.error("Error in alert of notification: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }; 

    //Listar
    async getListHasNotificationNewMessages(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const data = await this.redisClientService.getNotificationNewMessages(idUser);
            
            return res.status(200).json({result: data});
        } catch (error) {
            console.error("Error in get list of users connected: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

}