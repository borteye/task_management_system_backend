import express, { Router } from "express";
import * as controller from "../controllers/Task";

import { authenticateAccessToken } from "../../middlewares/JWTAuthenticator";

const router: Router = express.Router();

router.get(
  "/my-task/:id/:username",
  authenticateAccessToken,
  controller.getMyTasks
);

router.post("/add-task", authenticateAccessToken, controller.addTask);
router.post(
  "/mark-as-completed",
  authenticateAccessToken,
  controller.markAsCompleted
);
router.post("/edit-task", authenticateAccessToken, controller.editTask);
router.delete(
  "/delete-task/:task_id",
  authenticateAccessToken,
  controller.deleteTask
);

export default router;
