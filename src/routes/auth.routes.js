import { Router } from "express";
import { login, signUp } from "../controllers/auth.controllers.js";

const authRouter = Router()

authRouter.post("/signup", validateSchema(userSchema), signUp)
authRouter.post("/signin", validateSchema(loginSchema), login)

export default authRouter