//Importações
import { Request, Response } from "express";

//Services
import { LikeService } from "../services/LikeService";
import { PublicationService } from "../services/PublicationService";
import { WebSocketManager } from "../sockets/WebSocketsManeger";
import { NotificationServices } from "../services/NotifcationService";

//Class
export class LikeController {
    private likeService: LikeService;
    private publicationService: PublicationService;
    private notificationService: NotificationServices;

    constructor() {
        this.likeService = new LikeService();
        this.publicationService = new PublicationService();
        this.notificationService = new NotificationServices();
    };

    //Requisição para realizar o like
    async setLikeForPublication(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; //Pegando o id do usuário
            const idPublication = req.params.idPublication; //Pegando o id da publicação 

            //Buscando publicação pelo o ID
            const publicaiton = await this.publicationService.findDataPublication(idPublication);
            if (!publicaiton) return res.status(404).json({ mensage: "Not found Publication" });

            //Realizando like
            const createLike = await this.likeService.likedPublication(idPublication, idUser);
            if (!createLike.success) return res.status(404).json({ message: createLike.message });

            //Emit dado para o usuário
            await this.notificationService.createNotification({
                action:"SEE_PUBLICATION",
                content:"Liked in your publication",
                receiverId:publicaiton.userId,
                publicationId:idPublication,
                senderId:idUser,
                chatId: undefined
            });

            //Retornando os dados
            return res.status(201).json({ message: createLike.message, data: createLike.data });

        } catch (error) {
            console.error("Error liked publication: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    };

    //Requisição para relizar o deslike
    async setDeslikeForPublication(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; //Pegando o id do usuário
            const idPublication = req.params.idPublication; //Pegando o id da publicação 

            //Buscando publicação pelo o ID
            const publicaiton = await this.publicationService.findDataPublication(idPublication);
            if (!publicaiton) return res.status(404).json({ mensage: "Not found Publication" });

            //Realizando like
            const removeLike = await this.likeService.deslikedPublication(idPublication, idUser);
            if (!removeLike.success) return res.status(404).json({ message: removeLike.message });

            //Emit dado para o usuário
            await this.notificationService.createNotification({
                action:"SEE_PUBLICATION",
                content:"Desliked in your publication",
                receiverId:publicaiton.userId,
                publicationId:idPublication,
                senderId:idUser,
                chatId: undefined
            });
            
            //Retornando os dados
            return res.status(200).json({ message: removeLike.message });

        } catch (error) {
            console.error("Error liked publication: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    };

};