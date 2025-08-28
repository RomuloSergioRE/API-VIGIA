import request from "supertest";
import app from "../../app.js";
import { jest } from '@jest/globals';
import jwt from "jsonwebtoken";
import config from "../../config/config";
import Users from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import usersMock from "./mock/users.json";
import userService from "../../service/userService.js";
import AuthController from "../authController.js";
import sequelize from "../../config/dcConnect.js";
import verifyToken from "../../middlewares/verifyToken.js";

describe('User Controller', () => {

    let usertoken;
    let idUserAdmin;

    beforeAll(async () => {
        await sequelize.authenticate();
        // criando um USER ADMIN para o teste
        await userService.createUser(usersMock.adminUser);

        const req = {
            body: {
                email: usersMock.adminUser.email,
                password: usersMock.adminUser.password
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockImplementation((body) => {
                res.body = body
            }),
            set: jest.fn()
        }

        await AuthController.Login(req, res);

        usertoken = res.body.data.token;

        const reqUserAuth = {
            headers: {
                authorization: 'Bearer ' + usertoken
            }
        }

        await verifyToken(reqUserAuth, res, jest.fn())

        idUserAdmin = reqUserAuth.id
    });

    afterAll(async () => {

        // deletando um USER ADMIN para o teste
        await userService.destroyUser(usersMock.adminUser);


        await sequelize.close();
    });

    //OK
    it('GET(/auth/users) -> Deve mostrar todos os usuario cadastrados', async () => {
        const res = await request(app)
            .get('/auth/users')
            .set('Authorization', 'Bearer ' + usertoken);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    email: expect.any(String),
                    admin: expect.any(Boolean)
                })
            ])
        )
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('users found');
    })
    it('GET(/auth/user/:id) -> Deve mostrar o usuario pesquisado pelo ADMIN usando ID', async () => {

        // esse usuario ja esta criado no bando
        const userCreated = {
            id: 8,
            name: "romulo",
            email: "romulo@teste.com",
            admin: true,
        }

        const res = await request(app)
            .get(`/auth/user/${userCreated.id}`)
            .set('Authorization', 'Bearer ' + usertoken)

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual(
            expect.objectContaining({
                id: userCreated.id,
                name: userCreated.name,
                email: userCreated.email,
                admin: userCreated.admin
            })
        )
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('user found successfully');
    })
    it('GET(/auth/user/:id) -> Não deve mostrar o usuario(usuario nao existe) pesquisado pelo ID', async () => {
        const res = await request(app)
            .get(`/auth/user/${99999}`)
            .set('Authorization', 'Bearer ' + usertoken)

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual([])
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('user not found');
    })
    it('GET(/auth/user) -> Deve mostrar os dados do usuario logado pelo ID', async () => {
        const res = await request(app)
            .get(`/auth/user/${idUserAdmin}`)
            .set('Authorization', 'Bearer ' + usertoken)

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual(
            expect.objectContaining({
                id: idUserAdmin,
                name: usersMock.adminUser.name,
                email: usersMock.adminUser.email,
                admin: usersMock.adminUser.admin
            })
        )
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('user found successfully');
    })
})