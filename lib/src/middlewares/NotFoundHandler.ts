import { Request } from "express";
import { NotFoundError } from "../exceptions";

/**
 * @description
 * This is a validation middleware that checks all request location for the field to be validated
 * 
 * @function notFoundHandler
 * @param {Request} req Express req object
 */
export default (req: Request) => {
    throw new NotFoundError(`Method [${req.method}] not found for route [${req.originalUrl}]`);
};