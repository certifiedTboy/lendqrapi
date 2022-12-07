import { BodyValidator, checkRequestValidations } from "../../../lib/src/middlewares";
/**
 * @class Validators
 */
class BankValidator {

    /**
     * @method checkAccount
     * @static
     * @returns {any[]}
     */
    static checkAccount(): any[] {
    return [
        BodyValidator.checkNumeric("accountNumber"),
        // BodyValidator.checkLength("accountNumber", 10),
        BodyValidator.checkNonEmptyString("accountFirstName"),
        BodyValidator.checkNonEmptyString("accountSurname"),
        BodyValidator.checkNonEmptyString("bankName"),
        checkRequestValidations()
    ];
}

}


export default BankValidator