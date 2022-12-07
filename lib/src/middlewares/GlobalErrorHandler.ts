import K from "../constants";
import CustomError from "../exceptions/CustomError";
import { NextFunction, Request, Response } from "express";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GlobalErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode: number = err.statusCode || K.HttpStatusCode.SERVER_ERROR;
    const message: string = err.message || K.ResponseMessage.ERR_SERVER;
    const metaData: object = err.metaData || {};

    res.status(statusCode).send({ message, ...metaData });
};

export default GlobalErrorHandler;
