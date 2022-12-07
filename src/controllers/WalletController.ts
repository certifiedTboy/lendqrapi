import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { ResponseHandler } from "../../lib/src/helpers";
import config from "../config";
import { BadRequestError } from "../../lib/src/exceptions";
import WalletService from "../services/WalletService";

/**
 * @class WalletController
 */
class WalletController {
  /**
   * @method addMoneyToWallet
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async addMoneyToWallet(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    const token = config.PAYMENT_TOKEN
    const {userId, reference} = req.params
    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
    
          }
        }
        )
    
        if (response.data.status === false) {
          throw new BadRequestError(response.data.message)
        }
    
        if (response.data.data.status !== "success") {
          throw new BadRequestError(response.data.data.gateway_response)
        }
    
        const amount = response.data.data.amount
        const success = await WalletService.addMoneyToWalet(userId, amount)

        if(success){
            ResponseHandler.ok(res, undefined, "success")
        }
        
      } catch (err) {
        next(err);
      }

    }
}
export default WalletController;
