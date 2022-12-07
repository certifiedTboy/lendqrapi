import express from "express";
import VerificationController from "../controllers/VerificationController";
import Authenticate from "../middlewares/guard/Authenticate";
import VerificationValidator from "../middlewares/validators/verificationValidator";
// import Authenticate from "../middlewares/guards/Authenticate";

const router = express.Router();

router.post(
  "/email",
  VerificationValidator.checkEmail,
  VerificationController.sendVerificationCodeToEmail
);

router.post("/phonenumber", Authenticate, VerificationValidator.checkPhoneNumber, VerificationController.sendVerificationCodeToPhoneNumber)
router.post("/phonenumber/verify", Authenticate, VerificationController.verifyPhoneNumber)

export default router;
