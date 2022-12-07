import express from "express";
import UserController from "../controllers/UserController";
import Authenticate from "../middlewares/guard/Authenticate";
import Authorization from "../middlewares/guard/Authorization";
import upload from "../middlewares/multer/multer"
import UserValidator from "../middlewares/validators/UserValidator";
import verificationValidator from "../middlewares/validators/verificationValidator"

const router = express.Router();

router.post("", UserValidator.checkCreate(), verificationValidator.checkPhoneNumber, UserController.createUser);
router.get("/allUsers", Authenticate, Authorization, UserController.getAllUsers)
router.get("/profile", Authenticate, UserController.getAUser)
router.put("/profile/uploadimage", Authenticate, upload.single('image'), UserController.uploadProfileImage)
router.put("/profile/bvn", Authenticate, UserValidator.checkBvn, UserController.addBvn)

export default router;
