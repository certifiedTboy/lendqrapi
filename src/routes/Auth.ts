import express from "express";
import AuthController from "../controllers/AuthController";
import Authenticate from "../middlewares/guard/Authenticate";
// import AuthenticationValidator from "../middlewares/validators/AuthenticationValidator";


const router = express.Router();

router.post(
  "/passcode", AuthController.createPassCode
);

router.post(
  "/transactionId", Authenticate,
  AuthController.createTransactionId
);

router.post(
  "/transactionId/verify", Authenticate,
  AuthController.verifyTransactionIdForTransactions
);

router.post(
  "/login",
  // AuthenticationValidator.checkLoginWithEmail(),
  // AuthenticationValidator.checkEmailValidity,
  // AuthenticationValidator.checkPasscodeValidity,
  AuthController.login
);

router.get("/logout", AuthController.logout)

export default router;
