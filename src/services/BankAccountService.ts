import { ConflictError } from "../../lib/src/exceptions";
import { ICreateBankAccount } from "../interfaces/ICreateBankAccount";
import PaystackService from "./external/paystack"
import db from "../database/config/index";

/**
 * @class BankAccountService
 */
class BankAccountService {
  /**
   * @method addAccount
   * @static
   * @async
   * @param {object} bankData
   * @returns {Promise<BankAccount>}
   */
  static async addAccount(userId: string, data: any) {

    const bankData: ICreateBankAccount = {
      accountFirstName: data.accountFirstName,
        accountSurname: data.accountSurname,
        bankName: data.bankName,
        accountNumber: +data.accountNumber,
        userId
    };

    const nameData = {
      firstName: data.accountFirstName,
      surnName: data.accountSurname,
    };

    await this.checkThatNameCorrespond(userId, nameData);
    await this.checkThatAccountIsValid(data.bankName, data.accountNumber)
    const bankAccount = await db("bankDetails").insert(bankData);
    
    const [newAddedAccount] = await db
      .from("bankDetails")
      .select("*")
      .where("bankId", "=", bankAccount);

    return newAddedAccount;
  }

  /**
   * @method removeAccount
   * @static
   * @async
   * @param {string} id
   * @returns {Promise<void>}
   */
  static async removeAccount(accountId: string) {
    const removedAccount = await db("bankDetails")
      .where("bankId", accountId)
      .del(["bankId", "accountId"], { includeTriggerModifications: true });

    return removedAccount;
  }

  /**
   * @method checkThatNameCorrespond
   * @static
   * @async
   * @param {object} bankData
   * @returns {Promise<void>}
   */
  static async checkThatNameCorrespond(
    userId: string,
    bankName: any
  ){
    const [user] = await db
      .from("users")
      .select("*")
      .where("userId", "=", userId);
   
    if (user.firstName !== bankName.firstName || user.surnName !== bankName.surnName) {
      throw new ConflictError("provide your own account");
    }
  }

  /**
   * @method checkThatAccountIsValid
   * @static
   * @async
   * @param {object} bankData
   * @returns {Promise<void>}
   */
   static async checkThatAccountIsValid(
    bankName: string,
    accountNumber: string
  ){
    const response = await PaystackService.getBankCode(bankName, accountNumber)
    // double validate account name with response data
  }
}

export default BankAccountService;
