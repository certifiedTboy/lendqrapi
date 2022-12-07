import express from "express";
import BankAccountController from "../controllers/BankAccountController";
import Authenticate from "../middlewares/guard/Authenticate";
import BankValidator from "../middlewares/validators/BankValidator";

const router = express.Router();

router.post(
  "/addbank",
  BankValidator.checkAccount(),
  Authenticate,
  BankAccountController.addBankAccount
);
router.delete(
  "/remove/:accountId",
  Authenticate,
  BankAccountController.removeBankAccount
);

export default router;
