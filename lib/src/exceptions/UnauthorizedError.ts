import K from "../constants";
import CustomError from "./CustomError";

/**
 * @class UnauthorizedError
 */
class UnauthorizedError extends CustomError {

    /**
     * @constructor
     * @param message 
     * @param metaData 
     */
    constructor(message: string = K.ResponseMessage.ERR_UNAUTHENTICATED, metaData: object = {}) {

        super(K.HttpStatusCode.UNAUTHORIZED, message, metaData);

    }

}

export default UnauthorizedError;