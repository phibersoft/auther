import {Client, ClientConfig, Pool, PoolConfig} from "pg";
require('dotenv').config();

export const conf:PoolConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER
}

export const db = new Pool(conf);
