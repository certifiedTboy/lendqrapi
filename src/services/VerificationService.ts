import axios from "axios"
import db from "../database/config/index";
import UserService from "./UserService";
import AccountVerifyTokenService from "./AccountVerifyTokenService";
import {
  ICreateEmailVerificationData,
  ICreatePhoneNumberVerificationData,
} from "../interfaces/ICreateEmailVerificationData";
import {
  ConflictError,
  NotFoundError,
  UnauthenticatedError,
  UnprocessableError,
} from "../../lib/src/exceptions";
import { sendUserVerificationEmail } from "../services/external/emailSender";
import { sendSms } from "./SmsService";

/**
 * @class VerificationService
 */
class VerificationService {
  /**
   * @method createEmailVerificationData
   * @static
   * @async
   * @param {ICreateUser}
   * @returns {Promise<EmailVerification>}
   */
  static async createEmailForVerification(email: string) {
    await UserService.checkThatEmailExist(email);

    const generatedToken =
      await AccountVerifyTokenService.getVerificationCode();

    const [dataAlreadyCreated] = await db
      .from("verificationData")
      .select("*")
      .where("email", "=", email);

    if (dataAlreadyCreated) {
      const cratedEmail = dataAlreadyCreated.email;
      const otp = dataAlreadyCreated.OTP;
      await sendUserVerificationEmail(cratedEmail, "Valid customer", otp);

      return dataAlreadyCreated
    } else {
      const emailVerificationData: ICreateEmailVerificationData = {
        email,
        OTP: generatedToken,
      };
      const [verificationData] = await db("verificationData").insert(
        emailVerificationData
      );
      const [newData] = await db
        .from("verificationData")
        .select("*")
        .where("id", "=", verificationData);
      if(newData){
        await sendUserVerificationEmail(newData.email, "Valid customer", newData.OTP);

        return newData;
      }
    }

    
  }
  /**
   * @method verifyEmail
   * @static
   * @async
   * @param {ICreateUser} data
   * @returns {Promise<void>}
   */
  static async verifyEmail(email: string, OTP: number) {
    const otpVerification = await this.verifyEmailOTP(OTP, email);

    if (!otpVerification) {
      throw new ConflictError("Invalid Otp");
    }
    const updateVerificationData = {
      email: null,
      OTP: null,
    };
    await db("verificationData")
      .update(updateVerificationData)
      .where("email", email);
    return otpVerification;
  }

  /**
   * @method createPhoneNumberVerificationData
   * @static
   * @async
   * @param {ICreateUser}
   * @returns {Promise<phoneNumberVerification>}
   */
  static async createPhoneNumberForVerification(
    phoneNumber: string,
    userId: string
  ) {
    await UserService.checkThatPhoneNumberBelongsToUser(phoneNumber, userId);
    const generatedToken =
      await AccountVerifyTokenService.getVerificationCode();

    const [dataAlreadyCreated] = await db
      .from("verificationData")
      .select("*")
      .where("phoneNumber", "=", phoneNumber);

    let newData;

    if (dataAlreadyCreated) {
      newData = [dataAlreadyCreated];

      const phoneNo = dataAlreadyCreated.phoneNumber;
      const OTP = dataAlreadyCreated.OTP;
      //send sms message to provided phone number
      await sendSms(phoneNo, OTP);
      return newData;
    } else {
      const phoneVerificationData: ICreatePhoneNumberVerificationData = {
        phoneNumber,
        OTP: generatedToken,
      };
      const [verificationData] = await db("verificationData").insert(
        phoneVerificationData
      );

      [newData] = await db
        .from("verificationData")
        .select("*")
        .where("id", "=", verificationData);

      const phoneNo = newData.phoneNumber;
      //send sms message to provided phone number
      await sendSms(phoneNo, newData.OTP);
      return newData;
    }
  }

  /**
   * @method verifyPhoneNumber
   * @static
   * @async
   * @param {number} otp
   * @returns {Promise<void>}
   */
  static async verifyPhoneNumber(
    phoneNumber: string,
    OTP: number,
    userId: string
  ) {
    const otpVerification = await this.verifyPhoneOTP(phoneNumber, OTP);

    if (!otpVerification) {
      throw new ConflictError("Invalid Otp");
    }
    const updateVerificationData = {
      phoneNumber: null,
      OTP: null,
    };
    await db("verificationData")
      .update(updateVerificationData)
      .where("phoneNumber", phoneNumber);

    const phoneNumberIsVerified = true;

    await db("verificationStatus").where({ userId: userId }).update(
      {
        phoneNumberIsVerified: phoneNumberIsVerified,
      },
      ["userId", "phoneNumberIsVerified"]
    );

    return otpVerification;
  }

  /**
   * @method verifyBvn
   * @static
   * @async
   * @param {number} otp
   * @returns {Promise<void>}
   */
  static async verifyBvn(bvn: string, OTP: number, userId: string) {
    //TODO
    //bvn verification
    //require third party library
  }

  /**
   * @method verifyCard
   * @static
   * @async
   * @param {number} otp
   * @returns {Promise<void>}
   */
  static async verifyCard(cardData: any, OTP: number, userId: string) {
    //TODO
    //card data verification
    //require third party library
  }

  /**
   * @method verifyBankAccountData
   * @static
   * @async
   * @param {number} otp
   * @returns {Promise<void>}
   */
  static async verifyBankAccountData(
    bankData: any,
  ) {
    //TODO
    //bank account data verification
    //require third party library
  }
  /**
   * @method verifyOTP
   * @static
   * @async
   * @param {string} OTP
   * @returns {Promise<void>}
   */
  static async verifyEmailOTP(otp: number, email: string) {
    const [foundData] = await db
      .from("verificationData")
      .select("*")
      .where("email", "=", email);

    if (foundData) {
      if (foundData.OTP === otp) {
        return true;
      }
    }
  }

  /**
   * @method verifyPhoneOTP
   * @static
   * @async
   * @param {string} OTP
   * @returns {Promise<void>}
   */
  static async verifyPhoneOTP(phoneNumber: string, otp: number) {
    const [foundData] = await db
      .from("verificationData")
      .select("*")
      .where("phoneNumber", "=", phoneNumber);

    if (foundData) {
      if (foundData.OTP === otp) {
        return true;
      }
    }
  }

  /**
   * @method createUserVerificationStatus
   * @static
   * @async
   * @param {object} verificationStatusData
   * @returns {Promise<void>}
   */
  static async createUserVerificationStatus(verificationStatusData: any) {
    const [verificationData] = await db("verificationStatus").insert(
      verificationStatusData
    );
  }

  /**
   * @method checkThatEmailIsVerified
   * @static
   * @async
   * @param {string} id
   * @returns {Promise<void>}
   */
  static async checkThatEmailIsVerified(userId: string) {
    const [userVerification] = await db
      .from("verificationStatus")
      .select("*")
      .where("userId", "=", userId);
    if (!userVerification.emailIsVerified) {
      throw new UnprocessableError("email is not verified");
    }
  }

  /**
   * @method checkThatPhoneNumberIsVerified
   * @static
   * @async
   * @param {string} id
   * @returns {Promise<void>}
   */
  static async checkThatPhoneNumberIsVerified(userId: string) {
    const [userVerification] = await db
      .from("verificationStatus")
      .select("*")
      .where("userId", "=", userId);
    if (!userVerification.phoneNumberIsVerified) {
      throw new UnprocessableError("phone number is not verified");
    }
  }

  /**
   * @method checkThatBvnIsVerified
   * @static
   * @async
   * @param {string} id
   * @returns {Promise<void>}
   */
  static async checkThatBvnIsVerified(userId: string) {
    const [userVerification] = await db
      .from("verificationStatus")
      .select("*")
      .where("userId", "=", userId);
    if (!userVerification.bvnIsVerified) {
      throw new UnprocessableError("bvn is not verified");
    }
  }
}

export default VerificationService;
