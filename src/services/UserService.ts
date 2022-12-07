import { ICreateUser } from "../interfaces/ICreateUser";
import { ICreateVerificationStatus } from "../interfaces/ICreateVerificationStatus";
import db from "../database/config/index";
import {
  ConflictError,
  NotFoundError,
} from "../../lib/src/exceptions";
import VerificationService from "./VerificationService";
import WalletService from "./WalletService";
import PasswordHasher from "../helpers/PasswordHasher";


/**
 * @class UserService
 */
class UserService {
  /**
   * @method createUser
   * @static
   * @async
   * @param {ICreateUser} data
   * @returns {Promise<User>}
   */
  static async createUser(data: any) {
    await this.checkThatEmailExist(data.email);
    await this.checkThatPhoneNumberExist(data.phoneNumber);

    // verify user email with generated OTP
    const verifyEmail = await VerificationService.verifyEmail(
      data.email,
      data.OTP
    );

    if (verifyEmail) {
      // newUser data
      const newUserData: ICreateUser = {
        email: data.email,
        surnName: data.surnName,
        firstName: data.firstName,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        role: data.role,
        dateOfBirth: data.dateOfBirth,
      };

      // create newUser on email verification sucess
      const [user] = await db("users").insert(newUserData);
      const [newUser] = await db
        .from("users")
        .select("*")
        .where("userId", "=", user);
      if (newUser) {
        // current verification data of user
        const verificationData: ICreateVerificationStatus = {
          emailIsVerified: true,
          phoneNumberIsVerified: false,
          bvnIsVerified: false,
          userId: newUser.userId,
        };

        // update verification status of user
        await VerificationService.createUserVerificationStatus(
          verificationData
        );

        // create wallet for newly created user
        await WalletService.createWallet(newUser.userId);

        return newUser;
      }
    }
  }

  /**
   * @method checkThatEmailExist
   * @static
   * @async
   * @param {string} email
   * @returns {Promise<void>}
   */
  static async checkThatEmailExist(email: string) {
    const [foundUser] = await db
      .from("users")
      .select("*")
      .where("email", "=", email);
    if (foundUser) {
      throw new ConflictError("This email is already assigned to a user");
    }
  }

  /**
   * @method checkThatPhoneNumberExist
   * @static
   * @async
   * @param {string} email
   * @returns {Promise<void>}
   */
  static async checkThatPhoneNumberExist(phoneNumber: string): Promise<void> {
    const [foundUser] = await db
      .from("users")
      .select("*")
      .where("phoneNumber", "=", phoneNumber);
    if (foundUser) {
      throw new ConflictError(
        "This phone number is already assigned to a user"
      );
    }
  }


  /**
   * @method checkThatPhoneNumberBelongsToUser
   * @static
   * @async
   * @param {string} email
   * @returns {Promise<void>}
   */
   static async checkThatPhoneNumberBelongsToUser(phoneNumber: string, userId:string): Promise<void> {
    const [foundUser] = await db
      .from("users")
      .select("*")
      .where("userId", "=", userId);
    if (foundUser) {
      if(foundUser.phoneNumber !== phoneNumber){
        throw new ConflictError("provide your phone number")
      }
    }
  }

  /**
   * @method checkThatUserExistWithUserId
   * @static
   * @async
   * @param {string} userId
   * @returns {Promise<user>}
   */
  static async checkThatUserExistWithUserId(userId: string) {
    const [foundUser] = await db
      .from("users")
      .select("*")
      .where("userId", "=", userId);
    if (foundUser) {
      return foundUser;
    }

    throw new NotFoundError("user does not exist");
  }

  /**
   * @method checkThatUserExistWithEmail
   * @static
   * @async
   * @param {string} email
   * @returns {Promise<user>}
   */
  static async checkThatUserExistWithEmail(email: string) {
    const [foundUser] = await db
      .from("users")
      .select("*")
      .where("email", "=", email);
    if (foundUser) {
      return foundUser;
    }

    throw new NotFoundError("user does not exist");
  }

  /**
   * @method checkThatUserExistWithPhoneNumber
   * @static
   * @async
   * @param {string} phoneNumber
   * @returns {Promise<user>}
   */
  static async checkThatUserExistWithPhoneNumber(phoneNumber: string) {
    const [foundUser] = await db
      .from("users")
      .select("*")
      .where("phoneNumber", "=", phoneNumber);
    if (foundUser) {
      return foundUser;
    }

    throw new NotFoundError("user does not exist");
  }

  /**
   * @method updateUserPasscode
   * @static
   * @async
   * @param {string} userId
   * @returns {Promise<user>}
   */
  static async updateUserPasscode(userId: string, code: number) {
    const generatedPlainTextPassword = code.toString();
    const passCode = await PasswordHasher.hash(generatedPlainTextPassword);
    const updatePassCode = await db("users").where({ userId: userId }).update(
      {
        passCode: passCode,
      },
      ["userId", "passCode"]
    );

    if (updatePassCode) {
      return updatePassCode;
    }
  }

  /**
   * @method updateProfilePicture
   * @static
   * @async
   * @param {string} userId
   * @returns {Promise<user>}
   */
  static async updateProfilePicture(userId: string, imageUrl: string) {
    const updateUserImage = await db("users").where({ userId: userId }).update(
      {
        imageUrl: imageUrl,
      },
      ["userId", "imageUrl"]
    );

    if (updateUserImage) {
      return updateUserImage;
    }
  }

  /**
   * @method updateBvn
   * @static
   * @async
   * @param {number} bvn
   * @returns {Promise<user>}
   */
   static async updateBvn(userId: string, bvn: number) {
    // require third party api
    // await VerificationService.verifyBvn(userId, bvn)
    const updateBvn = await db("users").where({ userId: userId }).update(
      {
        bvn: bvn,
      },
      ["userId", "bvn"]
    );

    if (updateBvn) {
      return updateBvn;
    }
  }


   /**
   * @method updateTransactionId
   * @static
   * @async
   * @param {number} bvn
   * @returns {Promise<user>}
   */
    static async updateTransactionId(userId: string, code: number) {

      const generatedPlainTextPassword = code.toString()

      const transactionId = await PasswordHasher.hash(generatedPlainTextPassword);
      const updateTransactionId = await db("users").where({ userId: userId }).update(
        {
          transactionId: transactionId,
        },
        ["userId", "transactionId"]
      );
      
  
      if (updateTransactionId) {
        return updateTransactionId;
      }
    }

  /**
   * @method getUsers
   * @static
   * @async
   * @param {string}
   * @returns {Promise<users>}
   */
  static async getUsers() {
    const users = await db.select().table("users");
    return users;
  }

  /**
   * @method getUser
   * @static
   * @async
   * @param {string} userId
   * @returns {Promise<user>}
   */
  static async getUser(userId: string) {
    const user = await db("users")
      .join("userWallet", "users.userId", "=", "userWallet.userId")
      .select(
        "users.userId",
        "users.surnName",
        "users.firstName",
        "users.phoneNumber",
        "users.email",
        "users.role",
        "users.gender",
        "users.bvn",
        "users.dateOfBirth",
        "users.imageUrl",
        "userWallet.walletBalance",
        "userWallet.walletId",
        "users.lastLoginAt"
      );

   if(user){
    return user;
   }
  }
}

export default UserService;
