import express from "express";
import authMiddleware from "../middlewares/user.suth.middleware.js";


import { createTransaction, getTransactions, deleteTransaction , updateTransaction,  getTransactionById,  getTransactionSummary} from "../controllers/transaction.controller.js";


const router = express.Router();
console.log("TRANSACTION ROUTE FILE LOADED");

router.use((req, res, next) => {
  console.log("TRANSACTION REQUEST:", req.method, req.originalUrl);
  next();
});

 router.use(authMiddleware);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/summary", getTransactionSummary);
router.delete("/:id", deleteTransaction);
router.patch("/:id", updateTransaction);
router.get("/:id", getTransactionById);


export default router;