import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../../lib/src/exceptions";
/**
 * @function Authorization
 * @description Middleware to perform authorization in API routes
 * @param {any} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
const Authorization = (req: any, res: Response, next: NextFunction): void => {
        const { role } = req.user
    try {
        if(req.user){
            if(role === "ADMIN"){
                next()
            }else{
                throw new UnauthorizedError("invalid grant access, admin only")
            }
        }
    } catch(err) {
        next(err);
    }
};



export default Authorization;