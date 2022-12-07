import { UnprocessableError } from "../../lib/src/exceptions";
import db from "../database/config/index";
import TransactionService from "./TransactionServices";
import { generateRandomWalletNumber } from "../helpers/GenerateRandomToken";

/**
 * @class WalletService
 */
class WalletService {
  /**
   * @method createWallet
   * @static
   * @async
   * @param {number} number
   * @returns {Promise<void>}
   */
  static async createWallet(userId: string) {
    const walletNumber = await generateRandomWalletNumber()
    const walletData = {
      userId,
      walletNumber,
      walletBalance: 0,
    };
    await db("userWallet").insert(walletData);
  }

  /**
   * @method addMoneyToWallet
   * @static
   * @async
   * @param {number} amount
   * @returns {Promise<void>}
   */
  static async addMoneyToWalet(userId: string, amount: number) {
    await this.updateWallet(userId, amount, "INCOME");

    //update usertransaction details
    const transactionData = {
      title: "add money",
      description: "added money to wallet",
      amount: amount,
    };
    await TransactionService.createTransaction(userId, transactionData);
    return "success";
  }

  /**
   * @method updateWallet
   * @static
   * @async
   * @param {number} amount
   * @returns {Promise<void>}
   */
  static async updateWallet(userId: string, amount: number, type: string) {
    const [userWallet] = await db
      .from("userWallet")
      .select("*")
      .where("userId", "=", userId);

    let newBalance;
    // add amount to walletbalance if type income
    if (type === "INCOME") {
      newBalance = userWallet.walletBalance + amount;
    }

    // reduct payment from wallet balance if type payment
    if (type === "EXPENSE") {
      if (amount > userWallet.walletBalance) {
        throw new UnprocessableError(
          "payment can't be greater than current wallet balance"
        );
      }
      newBalance = userWallet.walletBalance - amount;
    }
    //update wallet balance
    await db("userWallet").where({ userId: userId }).update(
      {
        walletBalance: newBalance,
      },
      ["userId", "passCode"]
    );
  }
}

export default WalletService;
