import { it, expect, describe, beforeAll, afterAll, beforeEach } from "vitest";
import supertest from "supertest";
import { app } from "../app";
import { execSync } from "node:child_process";

describe('Meals Metrcis Routes', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () =>{
        execSync('npm run knex -- migrate:rollback --all');
        execSync('npm run knex -- migrate:latest');
    });

    it('should be able to get all meals', async () => {
        const userResponse = await supertest(app.server)
        .post('/diet/user')
        .send({
            name: "John Doe",
            email: "johndoe@email.com"
        });     

        const getUserResponse = await supertest(app.server)
        .get('/diet/user')
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .expect(200);
        
        const userId = getUserResponse.body.users[0].id;       

        await supertest(app.server)
        .post(`/diet/user/${userId}/meal`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .send({
            name: "Meal 1",
            description: "Meal 1",
        })
        .expect(201);

        await supertest(app.server)
        .post(`/diet/user/${userId}/meal`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .send({
            name: "Meal 2",
            description: "Meal 2",
        })
        .expect(201);

        const metrics = await supertest(app.server)
        .get(`/diet/user/${userId}/meal/metrics`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .expect(200);
       
        expect(metrics.body.diet).toEqual({
            "Total de Refeições": 2
        });
    });

    it('should be able to get all meals inside diet', async () => {
        const userResponse = await supertest(app.server)
        .post('/diet/user')
        .send({
            name: "John Doe",
            email: "johndoe@email.com"
        });     

        const getUserResponse = await supertest(app.server)
        .get('/diet/user')
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .expect(200);
        
        const userId = getUserResponse.body.users[0].id;       

        await supertest(app.server)
        .post(`/diet/user/${userId}/meal`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .send({
            name: "Meal 1",
            description: "Meal 1",
        })
        .expect(201);

        await supertest(app.server)
        .post(`/diet/user/${userId}/meal`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .send({
            name: "Meal 2",
            description: "Meal 2",
        })
        .expect(201);

        const insideDiet = await supertest(app.server)
        .get(`/diet/user/${userId}/meal/metrics/inside-diet`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .expect(200);
       
        expect(insideDiet.body.insideDiet).toEqual([{
            "Total de Refeições": 2
        }]);
    });

    it('should be able to get all meals off diet', async () => {
        const userResponse = await supertest(app.server)
        .post('/diet/user')
        .send({
            name: "John Doe",
            email: "johndoe@email.com"
        });     

        const getUserResponse = await supertest(app.server)
        .get('/diet/user')
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .expect(200);
        
        const userId = getUserResponse.body.users[0].id;       

        await supertest(app.server)
        .post(`/diet/user/${userId}/meal`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .send({
            name: "Meal 1",
            description: "Meal 1",
            diet: false,
        })
        .expect(201);

        await supertest(app.server)
        .post(`/diet/user/${userId}/meal`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .send({
            name: "Meal 2",
            description: "Meal 2",
            diet: false,
        })
        .expect(201);

        const offDiet = await supertest(app.server)
        .get(`/diet/user/${userId}/meal/metrics/off-diet`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .expect(200);
        
        expect(offDiet.body.offDiet).toEqual({
            "Total de Refeições": 2
        });
    });

    it('should be able to get best sequence of meals', async () => {
        const userResponse = await supertest(app.server)
        .post('/diet/user')
        .send({
            name: "John Doe",
            email: "johndoe@email.com"
        });     

        const getUserResponse = await supertest(app.server)
        .get('/diet/user')
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .expect(200);
        
        const userId = getUserResponse.body.users[0].id;       

        await supertest(app.server)
        .post(`/diet/user/${userId}/meal`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .send({
            name: "Meal 1",
            description: "Meal 1",
            diet: true
        })
        .expect(201);

        await supertest(app.server)
        .post(`/diet/user/${userId}/meal`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .send({
            name: "Meal 2",
            description: "Meal 2",
            diet: true
        })
        .expect(201);

        await supertest(app.server)
        .post(`/diet/user/${userId}/meal`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .send({
            name: "Meal 3",
            description: "Meal 3",
            diet: true
        })
        .expect(201);

        await supertest(app.server)
        .post(`/diet/user/${userId}/meal`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .send({
            name: "Meal 4",
            description: "Meal 4",
            diet: false
        })
        .expect(201);

        await supertest(app.server)
        .post(`/diet/user/${userId}/meal`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .send({
            name: "Meal 5",
            description: "Meal 5",
            diet: false
        })
        .expect(201);

        const bestSequence = await supertest(app.server)
        .get(`/diet/user/${userId}/meal/metrics/best-sequence`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .expect(200);
       
        expect(bestSequence.body).toEqual({
            Sequence: { "bestSequence": 3 } 
        });
    });
});