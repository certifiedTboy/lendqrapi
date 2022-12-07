import { Request, Response, NextFunction } from "express";
import { ServerError } from "../../lib/src/exceptions";
import { ResponseHandler } from "../../lib/src/helpers";
import PaystackService from "../services/external/paystack";
import TransactionService from "../services/TransactionServices";

/**
 * @class transactionController
 */
class TransactionController {
  
   /**
   * @method verifyAccountData
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
    static async verifyAccountData(req: any, res: Response, next: NextFunction) {
      const { bankName, accountNumber } = req.body;
      try {
        const response = await PaystackService.getBankCode(bankName, accountNumber)
        
        if(!response){
          throw new ServerError("something went wrong")
        }

        ResponseHandler.ok(res, response.account_name, "verification success")
      } catch (err) {
        next(err);
      }
    }


    /**
   * @method initateTransaction
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
     static async initateTransaction(req: any, res: Response, next: NextFunction) {
      const { bankName, accountNumber } = req.body;
      try {
        const response = await TransactionService.initiateTransaction(bankName, accountNumber)
        if(!response){
          throw new ServerError("something went wrong")
        }

        ResponseHandler.ok(res, response, "success")
      } catch (err) {
        next(err);
      }
    }
  

  /**
   * @method sendMoneyToUser
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async sendMoneyToUser(req: any, res: Response, next: NextFunction) {
    const userId = req.user.id;
    const { walletNumber, amount } = req.body;
    try {
      const sendMoney = await TransactionService.sendMoney(
        userId,
        walletNumber,
        amount
      );
      if (sendMoney) {
        ResponseHandler.ok(res, undefined, "money sent successfully");
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * @method withdrawFromWallet
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async withDrawFromWallet(req: any, res: Response, next: NextFunction) {
    const userId = req.user.id;
    const { amount, recipient  } = req.body;

    const reason = "withrawal from wallet"

    try {
      const withdrawal = await TransactionService.withdrawWalletBalance(
        userId,
        amount, 
        reason, 
        recipient
      );
      if (withdrawal) {
        ResponseHandler.ok(res, undefined, "require third party API");
      }
    } catch (err) {
      next(err);
    }
  }

   /**
   * @method sendMoneyToUserBank
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
    static async sendMoneyToUserBank(req: any, res: Response, next: NextFunction) {
      const userId = req.user.id;
      const { amount, recipient, reason  } = req.body;
      try {
        const sendMoney = await TransactionService.sendMoneyToBank(userId, amount, reason, recipient)
      
        if (sendMoney) {
          ResponseHandler.ok(res, undefined, "money sent successfully");
        }
      } catch (err) {
        next(err);
      }
    }
}

export default TransactionController;
