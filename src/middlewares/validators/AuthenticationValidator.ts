import {Request, Response, NextFunction} from "express"
import { UnprocessableError } from "../../../lib/src/exceptions";
import { BodyValidator, checkRequestValidations } from "../../../lib/src/middlewares";
/**
 * @class AuthenticationValidator
 */
class AuthenticationValidator {

    /**
     * @method checkLoginWithEmail
     * @static
     * @returns {any[]}
     */
    static checkLoginWithEmail(): any[] {
    return [
        BodyValidator.checkNonEmptyString("email"),
        BodyValidator.checkNumeric("passCode"),
        checkRequestValidations()
    ];
}


  /**
     * @method checkEmailValidity
     * @static
     * @returns {string}
     */
   static async checkEmailValidity(req:Request, res:Response, next:NextFunction) {
    const {email} = req.body
    try{
        const emailIsValid = email.includes("@")
        if(!emailIsValid) {
            throw new UnprocessableError("invalid email address")
        }else{
            next()
        }
    }catch(error){
        next(error)
    }
}

 /**
     * @method checkPasscodeValidity
     * @static
     * @returns {string}
     */
  static async checkPasscodeValidity(req:Request, res:Response, next:NextFunction) {
    const {passCode} = req.body
    try{
        const passcodeLengthIsValid = passCode.length < 6 && passCode.length > 6
        if(passcodeLengthIsValid) {
            throw new UnprocessableError("invalid password")
        }else{
            next()
        }
    }catch(error){
        next(error)
    }
}

}


export default AuthenticationValidator