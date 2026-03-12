import { Router } from "express";
import { compileDesignSystem } from "./compiler.controller.js";

const compilerRouter = Router();

compilerRouter.post("/compile", compileDesignSystem);

export default compilerRouter;
