import request from "supertest";
import app from "../../app.js";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import Users from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import usersMock from "./mock/users.json";
import userService from "../../service/userService.js";

describe('Auth Controller', () => {
    beforeAll(async () => {

        // criando um USER ADMIN para o teste
        await userService.createUser(usersMock.adminUser)

        // criando um USER NORMAL para o teste
        await userService.createUser(usersMock.normalUser)
    });

    afterAll(async () => { 

        // deletando um USER ADMIN para o teste
        await userService.destroyUser(usersMock.adminUser)

        // deletando um USER NORMAL para o teste
        await userService.destroyUser(usersMock.normalUser)

        // deletando um USER TEMPORARIO para o teste
        await userService.destroyUser(usersMock.tempUser)
    });

    //OK
    it('POST(/auth/login) -> Deve logar no sistema', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: usersMock.normalUser.email,
                password: usersMock.normalUser.password,
            })

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.auth).toBe(true);
        expect(res.body.data.token).toBeDefined();
        expect(res.body.message).toBe(usersMock.successMessage.loginSuccess);

        const decoded = jwt.verify(res.body.data.token, config.secretKey);

        expect(decoded).toHaveProperty('id');
        expect(decoded).toHaveProperty('role');
        expect(decoded.role).toBe(false);
    })
    // OK
    it('POST(/auth/login) -> Deve logar no sistema como ADMIN', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: usersMock.adminUser.email,
                password: usersMock.adminUser.password,
            })

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.auth).toBe(true);
        expect(res.body.data.token).toBeDefined();
        expect(res.body.message).toBe(usersMock.successMessage.loginSuccess);

        const decoded = jwt.verify(res.body.data.token, config.secretKey);

        expect(decoded).toHaveProperty('id');
        expect(decoded).toHaveProperty('role');
        expect(decoded.role).toBe(true);
    })
    //OK
    it('POST(/auth/login) -> Não deve logar no sistema com dados não cadastrados', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: usersMock.invalidUser.email,
                password: usersMock.invalidUser.password,
            })

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBe(null);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe(usersMock.errorMessage.userNotFoundError);


    })
    //OK
    it('POST(/auth/login) -> Não deve logar no sistema com senha invalida', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: usersMock.adminUser.email,
                password: usersMock.invalidUser.password,
            })

        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBe(null);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe(usersMock.errorMessage.passwordError);
    })
    //OK
    it('POST(/auth/register) -> Deve cadastrar um usuario no sistema', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                name: usersMock.tempUser.name,
                email: usersMock.tempUser.email,
                password: usersMock.tempUser.password,
                admin: usersMock.tempUser.admin
            })

        expect(res.status).toBe(201)
        expect(res.body.auth).toBe(true);
        expect(res.body.token).toBeDefined();
        expect(res.body.message).toBe(usersMock.successMessage.userCreated);

        const decoded = jwt.verify(res.body.token, config.secretKey);
        expect(decoded).toHaveProperty("id");
        expect(decoded).toHaveProperty("role");
        expect(decoded.role).toBe(false);

        const user = await Users.findOne({
            where: {
                email: usersMock.tempUser.email
            }
        });
        expect(user).not.toBeNull();

        const match = bcrypt.compareSync(usersMock.tempUser.password, user.password)
        expect(match).toBe(true)

    })
    //OK
    it('POST(/auth/register) -> Não deve cadastrar um usuario no sistema com email ja cadastrado', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                name: usersMock.adminUser.name,
                email: usersMock.adminUser.email,
                password: usersMock.adminUser.password,
                admin: usersMock.adminUser.admin
            })

        expect(res.status).toBe(409)
        expect(res.body.message).toBe(usersMock.errorMessage.userExistsError);
    })
})