import K from "../constants";
import CustomError from "./CustomError";

/**
 * @class ConflictError
 */
class ConflictError extends CustomError {

    /**
     * @constructor
     * @param message 
     * @param metaData 
     */
    constructor(message: string = K.ResponseMessage.ERR_CONFLICT, metaData: object = {}) {

        super(K.HttpStatusCode.CONFLICT, message, metaData);

    }

}

export default ConflictError;