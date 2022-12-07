import K from "../constants";
import CustomError from "./CustomError";

/**
 * @class BadRequestError
 */
class ServerError extends CustomError {

    /**
     * @constructor
     * @param message 
     * @param metaData 
     */
    constructor(message: string, metaData: object = {}) {

        super(K.HttpStatusCode.SERVER_ERROR, message, metaData);

    }

}

export default ServerError;