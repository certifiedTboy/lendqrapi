import UserService from "./UserService";
import { UnauthenticatedError } from "../../lib/src/exceptions";
import PasswordHasher from "../helpers/PasswordHasher";
import VerificationService from "./VerificationService";
import SessionService from "./SessionService";
import DevicePlatformDetector from "../helpers/DevicePlatformDetector";
import db from "../database/config";
// import PasswordResetTokenService from "./PasswordResetTokenService";
// const {sendPasswordResetUrl} = require("../services/external/sendEmail")

/**
 * @class AuthService
 */
class AuthService {
  /**
   * @method createPasscode
   * @static
   * @async
   * @param {string} userId
   * @param {string} passCode
   * @returns {Promise<User>}
   */
  static async createPasscode(userId: string, passCode: number): Promise<any> {
    const user = await UserService.checkThatUserExistWithUserId(userId);
    if (user) {
      await VerificationService.checkThatEmailIsVerified(userId);
      const createPassCode = await UserService.updateUserPasscode(
        userId,
        passCode
      );
      if (createPassCode) {
        return createPassCode;
      }
    }
  }

  
  /**
   * @method authenticate
   * @static
   * @async
   * @param {string} email
   * @param {string} password
   * @param {string} ipAddress
   * @param {string} userAgent
   * @returns {Promise<User>}
   */
  static async authenticate(
    email: string,
    phoneNumber:string,
    passCode: number,
    ipAddress: string,
    userAgent: string
  ): Promise<any> {

    let user
    if(!email){
      user = await UserService.checkThatUserExistWithPhoneNumber(phoneNumber);
    }

    if(!phoneNumber){
      user = await UserService.checkThatUserExistWithEmail(email);
    }
    
    const generatedPlainTextPassword =  passCode.toString()
    
    this.checkThatPasswordIsValid(generatedPlainTextPassword, user.passCode);

    const userSession = await SessionService.createOrUpdatePlatformSession(
      user,
      DevicePlatformDetector.getMobileCategory(userAgent),
      ipAddress
    );

    const newLoginDate = new Date();

    const updatedUser = await db("users").where({ userId: user.userId }).update(
      {
        lastLoginAt: newLoginDate,
      },
      ["userId", "lastLoginAt"]
    );

      const userData = {
        userId: user.userId,
        firstName: user.firstName,
        surnName: user.surnName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        imageUrl: user.imageUrl,
        dateOfBirth: user.dateOfBirth,
        lastLoginAt: user.lastLoginAt
      }

    const token = userSession.token;
    const loginData = {
      userData,
      token,
    };
    return loginData;
  }


  /**
   * @method authenticate
   * @static
   * @async
   * @param {string} userId
   * @param {string} transactionId
   * @returns {Promise<User>}
   */
   static async validateTransactionId(
    userId:string, code:number
  ): Promise<any> {

    const user = await UserService.checkThatUserExistWithUserId(userId)
    if(user){
      const generatedPlainTextPassword =  code.toString()
    
    this.checkThatPasswordIsValid(generatedPlainTextPassword, user.transactionId);
      return true
    }
   
  }

  /**
   * @method checkThatPasswordIsValid
   * @static
   * @param {string} plainTextPasword
   * @param {string} hashedPassword
   */
  static checkThatPasswordIsValid(
    plainTextPasword: string,
    hashedPassword: string
  ): void {
    if (!PasswordHasher.verify(plainTextPasword, hashedPassword)) {
      throw new UnauthenticatedError("incorrect code");
    }
  }
}

export default AuthService;
