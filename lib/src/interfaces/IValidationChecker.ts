import { ValidationChain } from "express-validator";

/**
 * @interface IValidationChecker
 */
interface IValidationChecker {
    (fields: string|string[]|undefined, message?: any): ValidationChain;
}

export default IValidationChecker;