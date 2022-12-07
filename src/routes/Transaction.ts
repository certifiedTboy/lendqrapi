import express from "express";
import Authenticate from "../middlewares/guard/Authenticate";
import TransactionController from "../controllers/TransactionController";

const router = express.Router();

router.post("/initiate_transaction", Authenticate, TransactionController.initateTransaction)
router.post("/sendmoney_to_user", Authenticate, TransactionController.sendMoneyToUser)
router.post("/withdraw_from_wallet", Authenticate, TransactionController.withDrawFromWallet)
router.post("/send_money_to_bank", Authenticate, TransactionController.sendMoneyToUserBank)
router.post("/verify_accountdata", Authenticate, TransactionController.verifyAccountData)

export default router;
