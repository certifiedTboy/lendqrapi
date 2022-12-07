import K from "../constants";
import CustomError from "./CustomError";

/**
 * @class UnauthenticatedError
 */
class UnauthenticatedError extends CustomError {

    /**
     * @constructor
     * @param message 
     * @param metaData 
     */
    constructor(message: string = K.ResponseMessage.ERR_UNAUTHENTICATED, metaData: object = {}) {

        super(K.HttpStatusCode.UNAUTHENTICATED, message, metaData);

    }

}

export default UnauthenticatedError;