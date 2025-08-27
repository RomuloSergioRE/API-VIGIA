import UserController from "../userController.js";
import jwt from 'jsonwebtoken';
import Users from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import { jest } from "@jest/globals"
import { mockUsers } from "./mock/users.js";



describe('User Controller', () => {
    it('Deve retorna dados de todos os Usuario Cadastrados', async () => {

        const req = {}
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(Users, "findAll").mockResolvedValue(mockUsers);

        await UserController.getAllUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "users found",
            data: expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    email: expect.any(String),
                    admin: expect.any(Boolean)
                })
            ])

        });

        Users.findAll.mockRestore();
    })
    it('Não deve retorna dados de todos os Usuario Cadastrados', async () => {

        const req = {}
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(Users, "findAll").mockResolvedValue(null);

        await UserController.getAllUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "users not found",
            data: []
        });

        Users.findAll.mockRestore();
    })
    it('Deve retorna os dados do Usuario pelo ID', async () => {

        const req = {
            params: {
                id: 2
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }


        jest.spyOn(Users, "findOne").mockImplementation(({ where: { user_id } }) => {
            const user = mockUsers.find(u => u.user_id === user_id);
            return Promise.resolve(user);
        });

        await UserController.getUserId(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            message: "user found successfully",
            data: expect.objectContaining({
                id: 2,
                name: "pedro",
                email: "pedro@teste.com",
                admin: false
            })
        });

        Users.findOne.mockRestore();
    })
    it('Não deve retorna os dados do Usuario pelo ID', async () => {

        const req = {
            params: {
                id: 2
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }


        jest.spyOn(Users, "findOne").mockResolvedValue(null);

        await UserController.getUserId(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            message: "user not found",
            data: []
        });

        Users.findOne.mockRestore();
    })
    it("Deve cadastrar um usuário", async () => {
        const req = {
            body: {
                name: "caio",
                email: "caio@teste.com",
                password: "123456",
                admin: false
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.spyOn(bcrypt, "hash").mockResolvedValue("mocked_hashed_password");
        jest.spyOn(Users, "create").mockResolvedValue({
            user_id: 4,
            name: "caio",
            email: "caio@teste.com",
            password: "mocked_hashed_password",
            admin: false
        });
        jest.spyOn(jwt, "sign").mockReturnValue("token");

        await UserController.registerUser(req, res);

        //expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
        expect(Users.create).toHaveBeenCalledWith({
            name: "caio",
            email: "caio@teste.com",
            password: "mocked_hashed_password",
            admin: false
        });

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "user created successfully",
            auth: true,
            token: "token"
        });

        bcrypt.hash.mockRestore();
        Users.create.mockRestore();
        jwt.sign.mockRestore();
    });
})