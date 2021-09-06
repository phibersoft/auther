import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import { DB_USERITEM } from "../helpers/interfaces";
import { db } from "../helpers/db";
import * as bcrypt from "bcrypt";
import {verify} from "jsonwebtoken";

const cookieDate = 60 * 1000 * 60 * 24 * 3;


export default async function LoginController(req: Request, res: Response) {
  const body = req.body as Pick<DB_USERITEM, "username" | "email" | "password">;

  const results = await db.query(
    `SELECT * FROM users WHERE username = $1 OR email = $2`,
    [body.username, body.email || ""]
  );
  if (results.rowCount !== 0) {
    const compare = await bcrypt.compare(
      body.password,
      results.rows[0].password
    );
    if (compare) {
      const cookie = jwt.sign(results.rows[0], process.env.JWT_SECRET, {
        expiresIn: cookieDate,
      });

      return res
        .cookie("phiber_auth", cookie, {
          maxAge: cookieDate,
        })
        .json({
          success: true,
          token: cookie,
        });
    }

    throw new Error("Wrong password!");
  }

  throw new Error("Wrong username or email!");
}

export const isLoginedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const phiber_auth = req.cookies.phiber_auth;
  if(phiber_auth){
    req['user'] = verify(phiber_auth, process.env.JWT_SECRET) as DB_USERITEM;

    next();
  }

  throw new Error('You cannot access this route. Reason: No Token Found');
}