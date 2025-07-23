//Importações
import {z, ZodError} from 'zod';
import { ActionNotification } from '@prisma/client';

//Validação para criação de uma notificação
export const createNotificationSchema = z.object({
    content: z.string()
        .min(3, {message: 'Message must be at least 3 characters long'})
        .max(150, {message: 'Message must be at most 200 characters long'}),
    receiverId: z.string(),
    senderId: z.string(),
    action: z.nativeEnum(ActionNotification),
    chatId: z.string().optional(),
    publicationId: z.string().optional(),
});