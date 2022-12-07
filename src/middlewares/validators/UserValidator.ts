import {Request, Response, NextFunction} from "express"
import { UnprocessableError } from "../../../lib/src/exceptions";
import { BodyValidator, checkRequestValidations } from "../../../lib/src/middlewares";

/**
 * @class projectValidator
 */
class UserValidator {

    /**
     * @method checkCreateUser
     * @static
     * @returns {any[]}
     */
    static checkCreate(): any[] {
    return [
        BodyValidator.checkNonEmptyString("email"),
        BodyValidator.checkNonEmptyString("firstName"),
        BodyValidator.checkNonEmptyString("surnName"),
        BodyValidator.checkNonEmptyString("phoneNumber"),
        BodyValidator.checkNonEmptyString("role"),
        BodyValidator.checkNumeric("OTP"),
        checkRequestValidations()
    ];
}


 /**
     * @method checkBvn
     * @static
     * @returns {any[]}
     */
  static async checkBvn (req:Request, res:Response, next:NextFunction) {
    const {bvn} = req.body
    try{
        if(bvn.length < 11 || bvn.length > 11){
            throw new UnprocessableError("invalid bvn")
        }

        next()
    }catch(error){
        next(error)
    }
}

}


export default UserValidator