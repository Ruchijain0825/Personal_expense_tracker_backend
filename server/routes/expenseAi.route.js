import express from "express";
import authMiddleware from "../middlewares/user.suth.middleware.js";

import {
  previewAITransaction,
} from "../controllers/expenseAi.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/preview", previewAITransaction);

export default router;