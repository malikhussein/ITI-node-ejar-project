import { Router } from "express";
import Process from "../controllers/process.controller.js";
import processJoiSchema from "../config/process.schema.js";
import { validation } from "../middleware/joi.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";

const processRouter = Router();

processRouter.post("/:productId", validation(processJoiSchema), authMiddleware, Process.createProcess);
processRouter.get("/", authMiddleware, Process.getAllProcesses);
processRouter.get("/:id", authMiddleware, Process.getProcess);
processRouter.put("/:id", authMiddleware, Process.updateStatus);
processRouter.delete("/:id", authMiddleware, Process.deleteProcess);

export default processRouter;
