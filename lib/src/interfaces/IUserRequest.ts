import { Request } from "express";

/**
 * @interface IUserRequest
 */
export interface IUserRequest extends Request {
    user?: any;
}