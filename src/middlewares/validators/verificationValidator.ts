import {Request, Response, NextFunction} from "express"
import { UnprocessableError } from "../../../lib/src/exceptions"
import {phone} from 'phone';
/**
 * @class VerificationValidator
 */
class VerificationValidator {

    /**
     * @method checkEmail
     * @static
     * @returns {any[]}
     */
   static async checkEmail (req:Request, res:Response, next:NextFunction) {
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
     * @method checkPhoneNumber
     * @static
     * @returns {any[]}
     */
     static async checkPhoneNumber (req:Request, res:Response, next:NextFunction) {
        const {phoneNumber} = req.body
        try{
            const response = phone(phoneNumber, {country: 'NG'});
            if(!response.isValid){
                throw new UnprocessableError("invalid phone number")
            }
            next()
        }catch(error){
            next(error)
        }
   }
}




export default VerificationValidator