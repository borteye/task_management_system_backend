import express, { Router } from "express";
import * as controller from "../controllers/Task";

import { authenticateAccessToken } from "../../middlewares/JWTAuthenticator";

const router: Router = express.Router();

router.get("/my-tasks/:id?/:username?", authenticateAccessToken, controller.getMyTasks);
