import { it, expect, describe, beforeAll, afterAll, beforeEach } from "vitest";
import supertest from "supertest";
import { app } from "../app";
import { execSync } from "node:child_process";

describe('Meal Routes', () => {
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

    it('should be able to create a new meal', async () => {
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
            description: "Meal 1"
        })
        .expect(201);
    });

    it('should be able to list all meals', async () => {
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
            description: "Meal 1"
        })
        .expect(201);

        const listMeals = await supertest(app.server)
        .get(`/diet/user/${userId}/meal`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .expect(200);

        expect(listMeals.body.meals).toEqual([expect.objectContaining({
            name: "Meal 1",
            description: "Meal 1"
        })]);
    });

    it('should be able to get a specific meal', async () => {
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
            description: "Meal 1"
        })
        .expect(201);

        const listMeals = await supertest(app.server)
        .get(`/diet/user/${userId}/meal`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .expect(200);

        const mealId = listMeals.body.meals[0].id;

        const getMeal = await supertest(app.server)
        .get(`/diet/user/${userId}/meal/${mealId}`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .expect(200);

        expect(getMeal.body.meal).toEqual(expect.objectContaining({
            name: "Meal 1",
            description: "Meal 1"
        }));
    });

    it('should be able to update a specific meal', async () => {
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
            description: "Meal 1"
        })
        .expect(201);

        const listMeals = await supertest(app.server)
        .get(`/diet/user/${userId}/meal`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .expect(200);

        const mealId = listMeals.body.meals[0].id;

        await supertest(app.server)
        .put(`/diet/user/${userId}/meal/${mealId}`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .send({
            name: "Meal 2",
            description: "Meal 2"
        })
        .expect(200);
    });

    it('should be able to update a specific meal', async () => {
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
            description: "Meal 1"
        })
        .expect(201);

        const listMeals = await supertest(app.server)
        .get(`/diet/user/${userId}/meal`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .expect(200)

        const mealId = listMeals.body.meals[0].id;

        await supertest(app.server)
        .delete(`/diet/user/${userId}/meal/${mealId}`)
        .set('Cookie', userResponse.get('Set-Cookie') as string[])
        .expect(204);
    });
});