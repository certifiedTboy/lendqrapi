import VerificationService from "../services/VerificationService"
import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../lib/src/helpers";




/**
 * @class VerificationController
 */
class VerificationController {
  /**
   * @method sendVerificationCodeToEmail
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async sendVerificationCodeToEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const createdData = await VerificationService.createEmailForVerification(email)
      ResponseHandler.created(res, createdData, "verification Data created");
    } catch (err) {
      next(err);
    }
  }

  /**
   * @method sendVerificationCodeToPhoneNumber
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async sendVerificationCodeToPhoneNumber(req: any, res: Response, next: NextFunction) {
    const userId = req.user.id
    try {
      const { phoneNumber } = req.body;
      const createdData = await VerificationService.createPhoneNumberForVerification(phoneNumber, userId)
      ResponseHandler.created(res, createdData, "verification Data created");
    } catch (err) {
      next(err);
    }
  }

  /**
   * @method verifyPhoneNumber
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
   static async verifyPhoneNumber(req: any, res: Response, next: NextFunction) {
    const userId = req.user.id
    try {
      const { phoneNumber, OTP } = req.body;
      const phoneNumberVerified = await VerificationService.verifyPhoneNumber(phoneNumber, OTP, userId)

      if(phoneNumberVerified){
        ResponseHandler.created(res, undefined, "phone verification successful");
      }
      
    } catch (err) {
      next(err);
    }
  }

}

export default VerificationController;
