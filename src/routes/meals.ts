import { FastifyInstance } from "fastify";
import { z } from "zod"
import { knex } from "../database";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";
import { randomUUID } from "node:crypto";

export const mealsRoutes = async (app: FastifyInstance) => {
    app.post('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        const CreateMealSchema = z.object({
            name: z.string(),
            description: z.string(),
            diet: z.boolean().default(true)
        });   
        const date = new Date();
        const { name, description } = CreateMealSchema.parse(request.body);
        await knex('meals').insert({
            id: randomUUID(), 
            name, description,
            created_at: date.toLocaleString(),
            updated_at: date.toLocaleString()
        });
        reply.status(201).send();
    });

    app.get('/', { preHandler: [checkSessionIdExists] }, async () => {
        const meals = await knex('meals').select('*');
        return { meals }
    });

    app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
        const GetMealsParamsSchema = z.object({
            id: z.string().uuid()
        });
        const { id } = GetMealsParamsSchema.parse(request.params);
        const meal = await knex('meals').where({ id }).first();
        return { meal }
    });

    app.put('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        const GetMealsParamsSchema = z.object({
            id: z.string().uuid()
        });
        const UpdateMealSchema = z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            diet: z.boolean().optional()
        });
        
        const date = new Date();

        const { id } = GetMealsParamsSchema.parse(request.params);
        const { name, description, diet } = UpdateMealSchema.parse(request.body);

        await knex('meals').where({ id }).update({
            name, description, diet, updated_at: date.toLocaleString()
        });
        return reply.status(200).send();
    });

    app.delete('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        const GetMealsParamsSchema = z.object({
            id: z.string().uuid()
        });
        const { id } = GetMealsParamsSchema.parse(request.params);
        await knex('meals').where({ id }).delete();
        return reply.status(204).send();
    });
}