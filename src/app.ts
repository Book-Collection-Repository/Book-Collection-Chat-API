//Importações
import express, {Application} from "express";
import http, { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { routes } from "./routes/routes";

//Sockets
import { WebSocketManager } from "./sockets/WebSocketsManeger";
import configureSocket from "./sockets/socket";

//Classe
export class App {
    private app: Application;
    private http: http.Server;
    private io: Server;
    private portApi : number;

    constructor() {
        //Configuraões de App
        this.app = express();
        this.configApp();

        //Configuração de htpp
        this.http = createServer(this.app);

        //Configuração do socket
        this.io = new Server(this.http, {
            cors: {
                origin: "http://localhost:5173", // Permitir conexões do cliente
                methods: ["GET", "POST", "DELETE", "PACTH", "PUT"], // Métodos permitidos
            },
        });
        this.listenerSocket();

        //Configuração da porta da api
        this.portApi = 4000
    }

    //Configurações de app
    configApp() {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(routes);
    }

    //Ouvindo o servidor
    listenerServer() {
        this.http.listen(this.portApi, () => {
            console.log(`Server is running in port: ${this.portApi}`);
        });
    };

    //Ouvindo o socket
    listenerSocket() {
        WebSocketManager.initialize(this.io);
        configureSocket(this.io);
    }
};