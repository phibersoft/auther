import * as express from "express";
import RegisterController from "../auth/Register.controller";
import LoginController, {isLoginedMiddleware} from "../auth/Login.controller";
import ResetPasswordController, {ResetPasswordController_SendMail} from "../auth/ResetPassword.controller";

const router = express.Router();
const wrapper = require("express-async-wrapper");

router.post("/register", wrapper(RegisterController));
router.post("/login", wrapper(LoginController));
router.get("/reset-password/:email", wrapper(ResetPasswordController_SendMail));
router.post('/reset-password', wrapper(ResetPasswordController));
router.get('/is-logined', wrapper(isLoginedMiddleware), (req, res) => {
    const wR = req['user'] || {};
    return res.json(wR);
})

export default router;