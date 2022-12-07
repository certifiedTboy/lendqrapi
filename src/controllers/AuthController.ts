import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../lib/src/helpers";
import AuthService from "../services/AuthService";
import UserService from "../services/UserService";

/**
 * @class UserController
 */
class AuthController {
  /**
   * @method createPassCode
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async createPassCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { passCode, userId } = req.body;
      const createPassCode = await AuthService.createPasscode(userId, passCode)

      if(createPassCode){
        ResponseHandler.ok(res, undefined, "passcode created")
      }
      
    } catch (err) {
      next(err);
    }
  }


   /**
   * @method createTransactionId
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
    static async createTransactionId(req: any, res: Response, next: NextFunction) {
      const userId = req.user.id
      const { code } = req.body;
      try {
        const createTransactionId = await UserService.updateTransactionId(userId, code)
  
        if(createTransactionId){
          ResponseHandler.ok(res, undefined, "transactionId upated")
        }
        
      } catch (err) {
        next(err);
      }
    }

     /**
   * @method verfiyTransactionIdForTransactions
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
      static async verifyTransactionIdForTransactions(req: any, res: Response, next: NextFunction) {
        const userId = req.user.id
        const { code } = req.body;
        try {
          const transactionIsValid = await AuthService.validateTransactionId(userId, code)
    
          if(transactionIsValid){
            ResponseHandler.ok(res, undefined, "transactionId isValid")
          }
          
        } catch (err) {
          next(err);
        }
      }

   /**
     * @method login
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * @returns {object}
     */
    static async login(req: Request, res: Response, next: NextFunction) {
      try {
          const { email, passCode, phoneNumber } = req.body
 
            const userWithToken = await AuthService.authenticate(
              email,
              phoneNumber, 
              passCode,
              req.ip,
              req.headers["user-agent"] || ""
          );
          ResponseHandler.ok(res, userWithToken, "Logged-in successfully!");
      } catch(err) {
          next(err);
      }
  }


   /**
     * @method logout
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * @returns {object}
     */
    static async logout(req: Request, res: Response, next: NextFunction) {
      try {
          res.clearCookie("authorization")
          ResponseHandler.ok(res, undefined, "Loggedout successfully!");
      } catch(err) {
          next(err);
      }
  }

}

export default AuthController;
