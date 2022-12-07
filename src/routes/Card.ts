import express from "express";
import CardController from "../controllers/CardController";
import Authenticate from "../middlewares/guard/Authenticate";
import CardValidator from "../middlewares/validators/CardValidator";

const router = express.Router();

router.post(
  "/add",
  CardValidator.checkCard(),
  Authenticate,
  CardController.addCard
);
router.delete("/remove/:cardId", Authenticate, CardController.removeCard);

export default router;
