import {Request, Response} from "express";
import {DB_USERITEM} from "../helpers/interfaces";
import * as bcrypt from "bcrypt";
import {db} from "../helpers/db";

const RegisterController = async (req: Request, res: Response) => {
    const body = req.body as DB_USERITEM;
    const encrypted = bcrypt.hashSync(body.password, 10);
    const query = `INSERT INTO users(username, email, password, avatar) VALUES ($1, $2, $3, $4)`;
    const args = [body.username, body.email, encrypted, body.avatar];
    const results = await db.query(query, args);
    return res.json(results);
}

export default RegisterController;