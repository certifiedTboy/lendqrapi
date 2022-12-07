import { Request, Response, NextFunction } from "express";
import BankAccountService from "../services/BankAccountService";
import { ResponseHandler } from "../../lib/src/helpers";


/**
 * @class BankAccountController
 */
class BankAccountController {
  /**
   * @method addBankAccount
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async addBankAccount(req: any, res: Response, next: NextFunction) {
    const userId = req.user.id;
    const { accountFirstName, accountSurname, bankName, accountNumber } = req.body;

    try {

      const BankAccountData = {
        accountFirstName,
        accountSurname,
        bankName,
        accountNumber,
      };
      const addedAccount = await BankAccountService.addAccount(
        userId,
        BankAccountData
      );
      ResponseHandler.created(res, addedAccount, "account added successfully");
    } catch (err) {
      next(err);
    }
  }

   /**
   * @method removeBankAccount
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
    static async removeBankAccount(req: any, res: Response, next: NextFunction) {
        const {accountId} = req.params
        try {
            const response = await BankAccountService.removeAccount(accountId)
         ResponseHandler.ok(res, undefined, "account removed successfully");
        } catch (err) {
          next(err);
        }
      }
}

export default BankAccountController;
