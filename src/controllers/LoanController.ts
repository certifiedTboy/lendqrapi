import { Request, Response, NextFunction } from "express";
import LoanService from "../services/LoanService";
import { ResponseHandler } from "../../lib/src/helpers";

/**
 * @class LoanController
 */
class LoanController {
  /**
   * @method applyLoan
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async applyLoan(req: any, res: Response, next: NextFunction) {
    const userId = req.user.id;
    try {
      const { purpose, status, guarantorName, guarantorPhoneNumber, amount, interest, days } =
        req.body;

      const loanData = {
        purpose,
        status,
        guarantorName,
        guarantorPhoneNumber,
        amount,
        interest,
        days
      };

      const loan = await LoanService.loanApplication(userId, loanData);
      ResponseHandler.created(res, loan, "application successful");
    } catch (err) {
      next(err);
    }
  }

  /**
   * @method updateLoanStatus
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async updateLoanStatus(req: any, res: Response, next: NextFunction) {
    const { role } = req.user;
    const { loanId } = req.params;
    const { status } = req.body;

    try {
      const loan = await LoanService.changeLoadStatus(loanId, status);

      if (loan.status === "APPROVED") {
        ResponseHandler.created(res, loan, "loan granted");
      }

      if (loan.status === "REJECTED") {
        ResponseHandler.created(res, loan, "loan rejected");
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * @method getAllLoanApplication
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async getAllLoanApplication(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const loansApplied = await LoanService.getAllLoans();
      ResponseHandler.ok(res, loansApplied, "success");
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method getLoanApplicationById
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async getLoanApplicationById(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    const { loanId } = req.params;
    try {
      const loan = await LoanService.getLoanById(loanId);
      ResponseHandler.ok(res, loan, "success");
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method getLoanApplicationByUserId
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
   static async getLoanApplicationByUserId(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    const { userId } = req.user;
    try {
      const loan = await LoanService.getLoanByUserId(userId);
      ResponseHandler.ok(res, loan, "success");
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method payAppliedLoan
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
   static async payAppliedLoan(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    const userId  = req.user.id;
    const loanId = req.params.loanId
    const {amount} = req.body
    try {
      const paidLoan = await LoanService.payLoan(userId, loanId, amount);
      
      if(paidLoan){
        ResponseHandler.ok(res, undefined, "loan payment successful");
      }
    } catch (error) {
      next(error);
    }
  }
}

export default LoanController;
