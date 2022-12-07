import config from "../config";
import { generateRandomToken } from "../helpers/GenerateRandomToken";
import { ConflictError, NotFoundError } from "../../lib/src/exceptions";

/**
 * @class AccountVerifyTokenService
 */
class AccountVerifyTokenService {

    /**
     * @method getVerifyAccountUrl
     * @static
     * @async
     * @param {string} userId 
     * @returns {Promise<number>}
     */
    static async getVerificationCode(): Promise<number> {
        const verificationToken = await generateRandomToken()
        return verificationToken
    }

  
}

export default AccountVerifyTokenService;