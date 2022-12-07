import { IValidationChecker } from "../../interfaces";
import { check, ValidationChain } from "express-validator";

type IMinMax = {
    min: number,
    max: number
};

/**
 * @description
 * This is a validation middleware that checks all request location for the field to be validated

 * @class BaseValidator
 */
export default class BaseValidator {

    protected static readonly location: IValidationChecker = check;

    /**
     * @method resolveRequired
     * @static
     * @param {string} field The name of the field to validate
     * @param {boolean} [required=true] Indicates whether the field been validated is required or not
     * @returns {ValidationChain}
     * @memberOf BaseValidator
     */
    private static resolveRequired(field: string, required: boolean) {
        if(required) {
            return BaseValidator.location(field)
                .exists()
                .withMessage(`[${field}] must be provided`);
        }
        return BaseValidator.location(field)
            .optional();
    }

    /**
     * @method checkExists
     * @static
     * @param {string} field The name of the field to validate
     * @returns {ValidationChain}
     * @memberOf BaseValidator
     */
    static checkExists(field: string): ValidationChain {
        return BaseValidator.resolveRequired(field, true);
    }

    /**
     * @method checkString
     * @static
     * @param {string} field The name of the field to validate
     * @param {boolean} [required=true] Indicates whether the field been validated is required or not
     * @returns {ValidationChain}
     * @memberOf BaseValidator
     */
    static checkString(field: string, required: boolean = true): ValidationChain {
        return BaseValidator.resolveRequired(field, required)
            .isString()
            .withMessage(`[${field}] must be a string`);
    }

    /**
     * @method checkNonEmptyString
     * @static
     * @param {string} field The name of the field to validate
     * @param {boolean} [required=true] Indicates whether the field been validated is required or not
     * @returns {ValidationChain}
     * @memberOf BaseValidator
     */
    static checkNonEmptyString(field: string, required: boolean = true): ValidationChain {
        return this.checkString(field, required)
            .notEmpty()
            .withMessage(`[${field}] must be a non-empty string`);
    }

    /**
     * @method checkArray
     * @static
     * @param {string} field The name of the field to validate
     * @param {boolean} [required=true] Indicates whether the field been validated is required or not
     * @param {IMinMax} [options]
     * @returns {ValidationChain}
     * @memberOf BaseValidator
     */
    static checkArray(field: string, required: boolean = true, options?: IMinMax): ValidationChain {
        return BaseValidator.resolveRequired(field, required)
            .isArray(options)
            .withMessage(`[${field}] must be an array`);
    }

    /**
     * @method checkThat
     * @static
     * @param {string} field The name of the field to validate
     * @param {boolean} [required=true] Indicates whether the field been validated is required or not
     * @returns {ValidationChain}
     * @memberOf BaseValidator
     */
    static checkThat(field: string, required: boolean = true): ValidationChain {
        return BaseValidator.resolveRequired(field, required);
    }

    /**
     * @method checkBoolean
     * @static
     * @param {string} field The name of the field to validate
     * @param {boolean} [required=true] Indicates whether the field been validated is required or not
     * @returns {ValidationChain}
     * @memberOf BaseValidator
     */
    static checkBoolean(field: string, required: boolean = true): ValidationChain {
        return BaseValidator.resolveRequired(field, required)
            .isBoolean()
            .withMessage(`[${field}] must be either true or false`)
            .toBoolean();
    }

    /**
     * @method checkNumeric
     * @static
     * @param {string} field The name of the field to validate
     * @param {boolean} [required=true] Indicates whether the field been validated is required or not
     * @returns {ValidationChain}
     * @memberOf BaseValidator
     */
    static checkNumeric(field: string, required: boolean = true): ValidationChain {
        return BaseValidator.resolveRequired(field, required)
            .isNumeric()
            .withMessage(`[${field}] must contain only numbers`);
    }

    /**
     * @method checkUUID
     * @static
     * @param {string} field The name of the field to validate
     * @param {boolean} [required=true] Indicates whether the field been validated is required or not
     * @returns {ValidationChain}
     * @memberOf BaseValidator
     */
    static checkUUID(field: string, required: boolean = true): ValidationChain {
        return BaseValidator.resolveRequired(field, required)
            .isUUID()
            .withMessage(`[${field}] must be a valid UUID`);
    }

    /**
     * @method checkPattern
     * @static
     * @param {string} field The name of the field to validate
     * @param {RegExp} pattern Pattern to match
     * @param {boolean} [required=true] Indicates whether the field been validated is required or not
     * @param {string} [message] A more descriptive error message
     * @returns {ValidationChain}
     * @memberOf BaseValidator
     */
    static checkPattern(field: string, pattern: RegExp, required: boolean = true, message?: string): ValidationChain {
        return BaseValidator.resolveRequired(field, required)
            .matches(pattern)
            .withMessage(message || `[${field}] does not match expected format`);
    }

    /**
     * @method checkEmail
     * @static
     * @param {string} [field=email] The name of the field to validate
     * @param {boolean} [required=true] Indicates whether the field been validated is required or not
     * @returns {ValidationChain}
     * @memberOf BaseValidator
     */
    static checkEmail(field: string = "email", required: boolean = true): ValidationChain {
        return BaseValidator.resolveRequired(field, required)
            .isEmail()
            .withMessage(`[${field}] must be a valid email`)
            .normalizeEmail();
    }

    /**
     * @method checkPhone
     * @static
     * @param {string} [field=phoneNumber] The name of the field to validate
     * @param {boolean} [required=true] Indicates whether the field been validated is required or not
     * @returns {ValidationChain}
     * @memberOf BaseValidator
     */
    static checkPhone(field: string = "phoneNumber", required: boolean = true): ValidationChain {
        return BaseValidator.checkPattern(field, /^$|^\+(\d){9,15}$/, required)
            .withMessage(`[${field}] has to be preceeded by a + and followed by numbers between lengths 9 and 15`);
    }

    /**
     * @method checkDate
     * @static
     * @param {string} field The name of the field to validate
     * @param {boolean} [required=true] Indicates whether the field been validated is required or not
     * @param {string} [format=YYYY-MM-DD] Indicates accepted date format
     * @returns {ValidationChain}
     * @memberOf BaseValidator
     */
    static checkDate(field: string, required: boolean = true, format = "YYYY-MM-DD"): ValidationChain {
        return BaseValidator.resolveRequired(field, required)
            .isDate({ format })
            .withMessage(`[${field}] must be a valid date with format ${format}`);
    }

    /**
     * @method compare
     * @static
     * @param {string} field The name of the field to validate
     * @param {string} benchmark The name of the field to benchmark the validating field against
     * @param {string} [message] A more descriptive error message
     * @returns {ValidationChain}
     * @memberOf BaseValidator
     */
    static compare(field: string, benchmark: string, message?: string): ValidationChain {
        return BaseValidator.resolveRequired(field, true)
            .custom(async (fieldValue: string, { req }: any) => {
                const benchmarkValue = req.body[benchmark];
                if (benchmarkValue !== fieldValue) {
                    throw new Error(message || `[${field}] must match with [${benchmark}]`);
                }
            });
    }

    /**
     * @method checkLength
     * @static
     * @param {string} field The name of the field to validate
     * @param {string} length The expected length of the field
     * @returns {ValidationChain}
     * @memberOf BaseValidator
     */
    static checkLength(field: string, length: number): ValidationChain {
        return BaseValidator.checkString(field)
            .isLength({min: length, max: length})
            .withMessage(`[${field}] length must be ${length}`);
    }

}