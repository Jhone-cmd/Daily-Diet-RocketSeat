import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export const  userRoutes = async  (app: FastifyInstance) => {
    app.post('/', async (request, reply) => {
        const CreateUserSchema = z.object({
            name: z.string(),
            email: z.string().email(),
        });
        let sessionId = request.cookies.sessionId;

        if(!sessionId) {
            sessionId = randomUUID();
            reply.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });
        }
        const date = new Date();
        const { name, email } = CreateUserSchema.parse(request.body);
        const verifyEmailExists = await knex('users').where({ email }).first()
        if(verifyEmailExists) return reply.status(409).send({ message: 'Email already exists' })
        
        await knex('users').insert({
            id: randomUUID(),
            session_id: sessionId,
            name,
            email,
            created_at: date.toLocaleString(),
            updated_at: date.toLocaleString(), 
        });

        return reply.status(201).send();
    });

    app.get('/', { preHandler: [checkSessionIdExists] }, async () => {
        const users = await knex('users').select('*');
        return { users }
    });

    app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
        const GetUserParamsSchema = z.object({
            id: z.string().uuid()
        });
        const { id } = GetUserParamsSchema.parse(request.params);
        const user = await knex('users').where({ id }).first();
        return { user }
    });

    app.put('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        const GetUserParamsSchema = z.object({
            id: z.string().uuid()
        });
        const UpdateUserSchema = z.object({
            name: z.string(),
            email: z.string().email()
        });
        const date = new Date();
        const { id } = GetUserParamsSchema.parse(request.params);
        const { name, email } = UpdateUserSchema.parse(request.body);
              
        await knex('users').where({ id }).update({
            name, email,
            updated_at: date.toLocaleString()      
        });
                
        return reply.status(200).send();
    });

    app.delete('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        const GetUserParamsSchema = z.object({
            id: z.string().uuid()
        });
        const { id } = GetUserParamsSchema.parse(request.params);
        await knex('users').where({ id }).delete();
        return reply.status(204).send();
    });
}