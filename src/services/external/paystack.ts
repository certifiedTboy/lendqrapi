import axios from "axios";
import { ServerError, UnprocessableError } from "../../../lib/src/exceptions";
import config from "../../config";
/**
 * @class PaystackService
 */
class PaystackService {
  /**
   * @method makePayment
   * @static
   * @async
   * @returns {Promise<Banks>}
   */
  static async makePayment(
    amount: number,
    reason: string,
    recipient: string
  ) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.SECRET_PAYMENT_TOKEN}`,
    };

    const data = {
      source: "balance",
      amount,
      recipient,
      reason,
    };

    const response = await axios.post(
      "https://api.paystack.co/transfer",
      data,
      {
        headers: headers,
      }
    );

    if (!response.status) {
      throw new ServerError("something went wrong");
    }

    return response;
  }

  /**
   * @method getBanks
   * @static
   * @async
   * @returns {Promise<Banks>}
   */
  static async getBanks() {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.SECRET_PAYMENT_TOKEN}`,
    };

    const response = await axios.get(
      `https://api.paystack.co/bank?currency=NGN`,
      {
        headers: headers,
      }
    );

    return response.data.data;
  }

  /**
   * @method getBankCode
   * @static
   * @async
   * @returns {Promise<Banks>}
   */
  static async getBankCode(bankName: string, accountNumber: string) {
    const banks = await this.getBanks();

    const bank = banks.find((bank: any) => bank.name === bankName);
    const bankNumber = bank.code;

    const bankData = await this.verifyBankDetails(accountNumber, bankNumber);

    return bankData;
  }

  /**
   * @method createRecipient
   * @static
   * @async
   * @returns {Promise<Banks>}
   */
  static async createRecipient(bankName: string, accountNumber: string) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.SECRET_PAYMENT_TOKEN}`,
    };

    const banks = await this.getBanks();

    const bank = banks.find((bank: any) => bank.name === bankName);

    const bankType = bank.type;
    const bankCurrency = bank.currency;
    const bankCode = bank.code;

    const userBankData = await this.verifyBankDetails(accountNumber, bankCode);

    const verifiedAccountName = userBankData.account_name;

    const verifiedAccountNumber = userBankData.account_number;

    const data = {
      type: bankType,
      name: verifiedAccountName,
      account_number: verifiedAccountNumber,
      bank_code: bankCode,
      currency: bankCurrency,
    };


    const response = await axios.post(
      `https://api.paystack.co/transferrecipient`,
      data,
      {
        headers: headers,
      }
    );

    if (!response.status) {
      throw new ServerError("something went wrong");
    }

    return response;
  }

  static async verifyBankDetails(accountNumber: string, bankCode: number) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.SECRET_PAYMENT_TOKEN}`,
    };

    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: headers,
      }
    );

    if (!response.status) {
      throw new UnprocessableError("Invalid bank details");
    }

    if (response.status) {
      return response.data.data;
    }
  }
}

export default PaystackService;
