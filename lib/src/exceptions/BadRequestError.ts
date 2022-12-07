import K from "../constants";
import CustomError from "./CustomError";

/**
 * @class BadRequestError
 */
class BadRequestError extends CustomError {

    /**
     * @constructor
     * @param message 
     * @param metaData 
     */
    constructor(message: string = K.ResponseMessage.ERR_BAD_REQUEST, metaData: object = {}) {

        super(K.HttpStatusCode.BAD_REQUEST, message, metaData);

    }

}

export default BadRequestError;