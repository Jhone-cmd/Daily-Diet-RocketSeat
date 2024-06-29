import { FastifyInstance } from "fastify";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";
import { knex } from "../database";

export const metricsRoutes = async (app: FastifyInstance) => {
    app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
        const diet = await knex('meals')
        .count('diet', { as: 'Total de Refeições:' }).first();              
        return { diet };
    });

    app.get('/inside-diet', { preHandler: [checkSessionIdExists] }, async () => {
        const insideDiet = await knex('meals')
        .where({ diet: true })
        .count('diet', { as: 'Total de Refeições:' });
        return { insideDiet };
    });

    app.get('/off-diet', { preHandler: [checkSessionIdExists] }, async (request) => {
        const offDiet = await knex('meals')
        .where({ diet: false })
        .count('diet', { as: 'Total de Refeições:' }).first();
        return { offDiet }
    });
}