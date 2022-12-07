import express from "express";
import LoanController from "../controllers/LoanController";
import Authenticate from "../middlewares/guard/Authenticate";
import Authorization from "../middlewares/guard/Authorization";
import Validators from "../middlewares/validators/BankValidator";

const router = express.Router();

router.get(
  "",
  Authenticate,
  Authorization,
  LoanController.getAllLoanApplication
);
router.get("", Authenticate, LoanController.getLoanApplicationByUserId);
router.get(
  "/:loanId",
  Authenticate,
  Authorization,
  LoanController.getLoanApplicationById
);
router.post("/apply", Authenticate, LoanController.applyLoan);
router.post(
  "/changestatus/:loanId",
  Authenticate,
  Authorization,
  LoanController.updateLoanStatus
);

router.post(
  "/payloan/:loanId",
  Authenticate,
  LoanController.payAppliedLoan
);

export default router;
