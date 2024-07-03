import { it, expect, describe, beforeAll, afterAll, beforeEach } from "vitest";
import supertest from "supertest";
import { app } from "../app";
import { execSync } from "node:child_process";

describe('User Routes', () => {
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

    it('should be able to create a new user', async () => {
        const response = await supertest(app.server)
        .post('/diet/user')
        .send({
            name: "John Doe",
            email: "johndoe@email.com"
        })
        .expect(201);

        const cookies = response.get('Set-Cookie');
        expect(cookies).toEqual(
            expect.arrayContaining([expect.stringContaining('sessionId')])
        );
    });

    it('should be able to list all users', async () => {
        const response = await supertest(app.server)
        .post('/diet/user')
        .send({
            name: "John Doe",
            email: "johndoe@email.com"
        });

        const cookies = response.get('Set-Cookie') as string[];

        const listUsers = await supertest(app.server)
        .get('/diet/user')
        .set('Cookie', cookies)
        expect(200);

        expect(listUsers.body.users).toEqual([expect.objectContaining({
            name: "John Doe",
            email: "johndoe@email.com"
        })]);
    });

    it('should be able to get a specific user', async () => {
        const response = await supertest(app.server)
        .post('/diet/user')
        .send({
            name: "John Doe",
            email: "johndoe@email.com"
        });

        const cookies = response.get('Set-Cookie') as string[];

        const userResponse = await supertest(app.server)
        .get('/diet/user')
        .set('Cookie', cookies)
        expect(200);

        const userId = userResponse.body.users[0].id;

        const getUser = await supertest(app.server)
        .get(`/diet/user/${userId}`)
        .set('Cookie', cookies)
        expect(200);

        expect(getUser.body.user).toEqual(expect.objectContaining({
            name: "John Doe",
            email: "johndoe@email.com"
        }));
    });

    it('should be able to update a specific user', async () => {
        const response = await supertest(app.server)
        .post('/diet/user')
        .send({
            name: "John Doe",
            email: "johndoe@email.com"
        });

        const cookies = response.get('Set-Cookie') as string[];

        const userResponse = await supertest(app.server)
        .get('/diet/user')
        .set('Cookie', cookies)
        expect(200);

        const userId = userResponse.body.users[0].id;

        await supertest(app.server)
        .put(`/diet/user/${userId}`)
        .set('Cookie', cookies)
        .send({
            name: "John Doe2",
            email: "johndoe2@email.com"
        })
        .expect(200);
    });

    it('should be able to delete a specific user', async () => {
        const response = await supertest(app.server)
        .post('/diet/user')
        .send({
            name: "John Doe",
            email: "johndoe@email.com"
        })

        const cookies = response.get('Set-Cookie') as string[];

        const userResponse = await supertest(app.server)
        .get('/diet/user')
        .set('Cookie', cookies)
        expect(200);

        const userId = userResponse.body.users[0].id;

        await supertest(app.server)
        .delete(`/diet/user/${userId}`)
        .set('Cookie', cookies)
        .expect(204);
    });

});