import { BodyValidator, checkRequestValidations } from "../../../lib/src/middlewares";
/**
 * @class Validators
 */
class CardValidator {

    /**
     * @method checkCard
     * @static
     * @returns {any[]}
     */
    static checkCard(): any[] {
    return [
        BodyValidator.checkNumeric("cardNumber"),
            BodyValidator.checkNumeric("CVV2"),
            BodyValidator.checkNumeric("cardPin"),
            BodyValidator.checkNumeric("cardNumber"),
            BodyValidator.checkNonEmptyString("cardType"),
            checkRequestValidations()
    ];
}

}


export default CardValidator
