/**
 * @class CustomError
 */
abstract class CustomError extends Error {

    statusCode: number;

    metaData: object;

    /**
     * @constructor
     * @param statusCode 
     * @param message 
     * @param metaData 
     */
    constructor(statusCode: number, message: string, metaData: object = {}) {

        super(message);

        this.statusCode = statusCode;

        this.metaData = metaData;

    }

}

export default CustomError;