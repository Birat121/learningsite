import express from "express";
import {
  createModule,
  getModules,
  getModuleById,
  updateModule,
  deleteModule,
} from '../controllers/moduleController.js';

const moduleRouter = express.Router();

moduleRouter.post("/module", createModule);
moduleRouter.get("/module", getModules);
moduleRouter.get("/module/:id", getModuleById);
moduleRouter.put("/module/:id", updateModule);
moduleRouter.delete("/module/:id", deleteModule);

export default moduleRouter;
