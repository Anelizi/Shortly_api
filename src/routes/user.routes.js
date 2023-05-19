import { Router } from "express";
import { getRanking, getUser } from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.get("/users/me", getUser);
userRouter.get("/ranking", getRanking);

export default userRouter;