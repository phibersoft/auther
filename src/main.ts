import * as express from "express";
import * as helmet from "helmet";
import router from "./routes";
import * as cookieParser from "cookie-parser";
import {verify} from "jsonwebtoken";

require("dotenv").config();

const PORT = process.env.PORT || 9090;
const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  require('dotenv').config();
  next();
})



app.get("/", async (req, res) => {
  try {
    return res.json({
      success: true,
      developer: 'Phiber'
    })
  } catch (e) {
    return res.json(e.message);
  }
});


app.get("/reset-password", async (req, res) => {
  const token = req.query.token as string;

  if(token){
    const sign = verify(token, process.env.JWT_SECRET);
    return res.json({
      sign
    })
  }

  return res.json('No token found.');
})

const errorHandler = async (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }

  return res.json({
    success: false,
    message: "No error found.",
  });
};

app.use("/auth", router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Up! Listening On: http://localhost:${PORT}`);
});
