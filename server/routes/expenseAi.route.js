import express from "express";
import devAuthMiddleware from "../middlewares/dev.auth.middleware.js";

import {
  previewAITransaction,
} from "../controllers/expenseAi.controller.js";

const router = express.Router();

router.use(devAuthMiddleware);

router.post("/preview", previewAITransaction);

export default router;