import { Router } from "express";
import { deleteUrl, getId, getOpen, postUrl } from "../controllers/urls.controllers.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", postUrl);
urlRouter.get("/urls/:id",getId);
urlRouter.get("/urls/open/:shortUrl", getOpen);
urlRouter.delete("/urls/:id", deleteUrl);

export default urlRouter;