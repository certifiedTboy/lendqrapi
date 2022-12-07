import { UnprocessableError } from "../../lib/src/exceptions";
import db from "../database/config/index";
import { ICreateTransaction } from "../interfaces/ICreateTransaction";
import PaystackService from "./external/paystack";
import WalletService from "./WalletService";

/**
 * @class TransactionService
 */
class TransactionService {
  /**
   * @method createTransaction
   * @static
   * @async
   * @param {object} data
   * @returns {Promise<UserTransactionDetails>}
   */
  static async createTransaction(userId: string, data: any) {
    const transactionData: ICreateTransaction = {
      title: data.title,
      description: data.description,
      amount: data.amount,
      userId,
    };
    await db("userTransactions").insert(transactionData);
  }

   /**
   * @method sendMoney
   * @static
   * @async
   * @param {object} data
   * @returns {Promise<UserTransactionDetails>}
   */
    static async sendMoney(senderId: string, walletNumber:number, amount:number) {
      const [senderWallet] = await db.from("userWallet").select("*").where("userId", "=", senderId)
      const [receiverWallet] = await db.from("userWallet").select("*").where("walletNumber", "=", walletNumber)
      if(senderWallet && receiverWallet){
        if(senderWallet.walletBalance < amount){
          throw new UnprocessableError("insufficient balance")
        }
        // update sender wallet balance
        await WalletService.updateWallet(senderId, amount, "EXPENSE")

        //update receiver wallet balance
        await WalletService.updateWallet(receiverWallet.userId, amount, "INCOME")

        return true
      }
    }

     /**
   * @method initiateTrasaction
   * @static
   * @async
   * @param {object} data
   * @returns {Promise<UserTransactionDetails>}
   */
      static async initiateTransaction(bankName: string, accountNumber:string) {
       
        const response = await PaystackService.createRecipient(bankName, accountNumber)
  
        return response.data
      }
    
    /** 
    * @method withdrawWalletBalance
    * @static
    * @async
    * @param {object} data
    * @returns {Promise<UserTransactionDetails>}
    */
     static async withdrawWalletBalance(userId:string, amount:number, reason:string, recipient:string) {
       const [userWallet] = await db.from("userWallet").select("*").where("userId", "=", userId)
       const [userBank] = await db.from("bankDetails").select("*").where("userId", "=", userId)
       if(!userBank){
        throw new UnprocessableError("add bank account")
       } 
       
         if(userWallet.walletBalance < amount){
           throw new UnprocessableError("insufficient balance")
         }
         

         const withdrawal = await PaystackService.makePayment(amount, reason, recipient)
         if(withdrawal) {

          // update sender wallet balance
         await WalletService.updateWallet(userId, amount, "EXPENSE")

         // create trasaction record
         const transactionData = {
          title: "withdrawal to wallet", 
          description: reason, 
          amount
         }

         await this.createTransaction(userId, transactionData)

         return withdrawal
         }
       
     }


     /** 
    * @method sendMoneyToBank
    * @static
    * @async
    * @param {object} data
    * @returns {Promise<UserTransactionDetails>}
    */
      static async sendMoneyToBank(userId: string, amount:number, reason:string, recipient:string) {
        const [userWallet] = await db.from("userWallet").select("*").where("userId", "=", userId)
        
          if(userWallet.walletBalance < amount){
            throw new UnprocessableError("insufficient balance")
          }


          const sentMoney = await PaystackService.makePayment(amount, reason, recipient)
      
          if(sentMoney){

            // update sender wallet balance
            await WalletService.updateWallet(userId, amount, "EXPENSE")

            // create transaction record
            const transactionData = {
              title: "Money Transfer", 
              description: reason, 
              amount
            }
  
            await this.createTransaction(userId, transactionData)
          
            return sentMoney
          }
          
      }
}

export default TransactionService;
