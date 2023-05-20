import { Router } from "express";
import { deleteUrl, getId, getOpen, postUrl } from "../controllers/urls.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { urlSchema } from "../schemas/urls.schema.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateSchema(urlSchema), postUrl);
urlRouter.get("/urls/:id",getId);
urlRouter.get("/urls/open/:shortUrl", getOpen);
urlRouter.delete("/urls/:id", deleteUrl);

export default urlRouter;