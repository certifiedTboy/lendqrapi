import K from "../constants";
import CustomError from "./CustomError";

/**
 * @class UnprocessableError
 */
class UnprocessableError extends CustomError {

    /**
     * @constructor
     * @param message 
     * @param metaData 
     */
    constructor(message: string = K.ResponseMessage.ERR_UNPROCESSABLE, metaData: object = {}) {

        super(K.HttpStatusCode.UNPROCESSABLE_ENTITY, message, metaData);

    }

}

export default UnprocessableError;