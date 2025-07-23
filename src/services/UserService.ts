//Importações
import { prisma } from "../connection/prisma";

//Type
import { CreateUserDTO, UpdatePasswordUserDTO, UpdateProfileUserDTO } from "../types/userTypes";

//Class
export class UserService {

    //Retornar todos os usuários cadastrados no sistema
    async getAllUsers() {
        return await prisma.user.findMany({
            include: {
                avaliations: true,
                followers: true,
                following: true,
                publications: true,
            }
        });
    };

    //Procura um usuário com um determinado id
    async getUserByID(id: string) {
        return await prisma.user.findUnique({
            where: { id },
            include: {
                avaliations: true,
                publications: true,
                followers: true,
                following: true,
            }
        });
    };

    //Procura um usuário com um determinado email
    async getUserByEmail(email: string) {
        const userEmail = await prisma.user.findUnique({
            where: { email },
            include: {
                avaliations: true,
                publications: true,
            }
        });

        return userEmail;
    };

    //Procurar um usuário com um determinado email, mas com id diferente
    async getUserByEmailButNotID(email: string, id: string) {
        const data = await prisma.user.findFirst({
            where: {
                email,
                id: { not: id }
            }
        });

        return data;
    };

    // Procura um usuário com um determinado nome de perfil
    async getUserByProfileName(profileName: string) {
        const userProfileName = await prisma.user.findMany({
            where: {
                profileName: {
                    contains: profileName, // Busca que inclui a string no nome do perfil
                    mode: 'insensitive',   // Tornando a busca case-insensitive, se necessário
                },
            },
            include: {
                avaliations: true,
                collections: true,
                publications: true,
                readingDiaries: {
                    include: {
                        book: true,
                    }
                },
            }
        });

        return userProfileName;
    };

    //Procurando um usuário com um determinado nome de perfil, mas com id diferente
    async getUserByProfileNameButNotID(profileName: string, id: string) {
        const data = await prisma.user.findFirst({
            where: {
                profileName,
                id: { not: id }
            }
        });

        return data;
    }

    // Validando se existe um usuário com o mesmo e-mail ou nome de perfil
    async validateUserInformation(email: string, profileName: string): Promise<string | null> {
        const emailExists = await this.getUserByEmail(email);
        const profileNameExists = await this.getUserByProfileName(profileName);

        if (emailExists) return 'Email already exists';
        if (profileNameExists) return 'Profile name already exists';

        return null;
    };

    async validateUserInformationUpdate(email: string, profileName: string, idUser: string): Promise<string | null> {
        const emailExists = await this.getUserByEmailButNotID(email, idUser);
        const profileNameExists = await this.getUserByProfileNameButNotID(profileName, idUser);

        if (emailExists) return 'Email already exists';
        if (profileNameExists) return 'Profile name already exists';

        return null;
    };

    // Bloqueia operação concorrente
    async lockedOptimistUser(id: string, version: number) {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (version !== user?.version) return { success: false, status: 400, message: "The user version is not compatible with the database version" };

        return { success: true, status: 200, message: "The user version compatible with the database version" };
    }

    //Incrementando os contadores de seguindo
    async incrementFollowingCount(id: string) {
        await prisma.user.update({
            where: { id },
            data: { followingCount: { increment: 1 } },
        });
    };

    //Incrementeando os contadores de seguidores
    async incrementFollowersCount(id: string) {
        await prisma.user.update({
            where: { id },
            data: { followersCount: { increment: 1 } },
        });
    };

    //Decremetando os contradores de seguindo
    async decrementFollowingCount(id: string) {
        await prisma.user.update({
            where: { id },
            data: { followingCount: { decrement: 1 } },
        });
    };

    //Decrementeando os contadores de seguidores
    async decrementFollowersCount(id: string) {
        await prisma.user.update({
            where: { id },
            data: { followersCount: { decrement: 1 } },
        });
    };
}