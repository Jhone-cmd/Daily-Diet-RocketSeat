import { FastifyInstance } from "fastify";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";
import { knex } from "../database";

export const metricsRoutes = async (app: FastifyInstance) => {
    app.get('/', { preHandler: [checkSessionIdExists] }, async () => {
        const diet = await knex('meals')
        .count('diet', { as: 'Total de Refeições' }).first();              
        return { diet };
    });

    app.get('/inside-diet', { preHandler: [checkSessionIdExists] }, async () => {
        const insideDiet = await knex('meals')
        .where({ diet: true })
        .count('diet', { as: 'Total de Refeições' });
        return { insideDiet };
    });

    app.get('/off-diet', { preHandler: [checkSessionIdExists] }, async () => {
        const offDiet = await knex('meals')
        .where({ diet: false })
        .count('diet', { as: 'Total de Refeições' }).first();
        return { offDiet }
    });

    app.get('/best-sequence', { preHandler: [checkSessionIdExists] }, async () => {
        const totalMeals = await knex('meals').select('*')
        const { bestSequence }  = totalMeals.reduce(
            (count, meal) => {
              if (meal.diet == true) {
                count.currentSequence += 1
              } else {
                count.currentSequence = 0
              }
    
              if (count.currentSequence > count.bestSequence) {
                count.bestSequence = count.currentSequence
              }
              return count
            },
            { bestSequence: 0, currentSequence: 0 },
          )
        return { Sequence: { bestSequence } }
    });
}