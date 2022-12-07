import db from "../database/config/index";
import { NotFoundError } from "../../lib/src/exceptions";
import VerificationService from "./VerificationService";
import WalletService from "./WalletService";
import TransactionService from "./TransactionServices";
import { ICreateLoan } from "../interfaces/ICreateLoan";
import { ICreateTransaction } from "../interfaces/ICreateTransaction";
import LoanPaydayCalculator from "../helpers/LoanPaydayCalculator";

/**
 * @class LoanService
 */
class LoanService {
  /**
   * @method loanApplication
   * @static
   * @async
   * @param {ICreateLoan}
   * @returns {Promise<loan>}
   */
  static async loanApplication(userId: string, data: any) {
    await VerificationService.checkThatEmailIsVerified(userId);
    await VerificationService.checkThatPhoneNumberIsVerified(userId);
   /*  await VerificationService.checkThatBvnIsVerified(userId); */

    const loanData: ICreateLoan = {
      purpose: data.purpose,
      status: data.status,
      guarantorName: data.guarantorName,
      guarantorPhoneNumber: data.guarantorPhoneNumber,
      amount: data.amount,
      interest: data.interest,
      days: data.days,
      userId,
    };

    const [loan] = await db("loanDetails").insert(loanData);

    const [newLoan] = await db
      .from("loanDetails")
      .select("*")
      .where("loanId", "=", loan);
    return newLoan;
  }

  /**
   * @method changeLoanStatus
   * @static
   * @async
   * @param {ICreateLoan}
   * @returns {Promise<loan>}
   */
  static async changeLoadStatus(loanId: string, status: string) {
    const [loan] = await db
      .from("loanDetails")
      .select("*")
      .where("loanId", "=", loanId);

      
      const payday = await LoanPaydayCalculator.calculatePayday(loan.days)
      
    //update loan status if accepted
    if (status === "APPROVED") {
      await db("loanDetails").where({ loanId: loanId }).update(
        {
          payday: payday,
          status: status
        },
        ["loanId", "status"]
      );
      //update loan applicant wallet
      await WalletService.updateWallet(loan.userId, loan.amount, "INCOME");

      //update usertransaction details
      const transactionData = {
        title: "loan approval",
        description: "your request loan is approved",
        amount: loan.amount,
      };
      await TransactionService.createTransaction(loan.userId, transactionData);
      return loan;
    }

    //update loan status if rejected
    if (status === "REJECTED") {
      await db("loanDetails").where({ loanId: loanId }).update(
        {
          status: status,
        },
        ["loanId", "status"]
      );

      return loan;
    }
  }

  /**
   * @method getAllLoans
   * @static
   * @async
   * @param {null}
   * @returns {Promise<loan>}
   */
  static async getAllLoans() {
    const loans = db.select().table("loanDetails");
    return loans;
  }

  /**
   * @method getLoanById
   * @static
   * @async
   * @param {string} loanId
   * @returns {Promise<loan>}
   */
  static async getLoanById(loanId: string) {
    const [loan] = db
      .from("loanDetails")
      .select("*")
      .where("loanId", "=", loanId);
    if (!loan) {
      throw new NotFoundError("loan does not exist");
    }
    return loan;
  }

  /**
   * @method getLoanByUserId
   * @static
   * @async
   * @param {string} userId
   * @returns {Promise<loan>}
   */
  static async getLoanByUserId(userId: string) {
    const [loan] = db
      .from("loanDetails")
      .select("*")
      .where("userId", "=", userId);
    if (!loan) {
      throw new NotFoundError("loan does not exist");
    }
    return loan;
  }

  /**
   * @method payLoan
   * @static
   * @async
   * @param {string} loanId
   * @returns {Promise<loan>}
   */
  static async payLoan(userId: string, loanId: string, amount: number) {
    const payLoan = await db("loanDetails")
      .where("loanId", loanId)
      .del(["loanId", "loanId"], { includeTriggerModifications: true });

    if (payLoan) {
      //update loan applicant wallet
      await WalletService.updateWallet(userId, amount, "EXPENSE");

      //update usertransaction details
      const transactionData = {
        title: "loan payment",
        description: "payment for loan",
        amount: amount,
      };
      await TransactionService.createTransaction(userId, transactionData);
    }

    return payLoan
  }
}

export default LoanService;
