import { Router } from 'express';
import { compileDesignSystemHandler } from './compiler.controller.js';

const router = Router();

router.post('/compile', compileDesignSystemHandler);

export default router;
