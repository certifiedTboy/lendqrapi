import config from "../config"
import JWT, { JwtPayload } from "jsonwebtoken";
import { UnauthenticatedError } from "../../lib/src/exceptions";

/**
 * @class JwtHelper
 */
class JwtHelper {

    /**
     * @method generateToken
     * @static
     * @param {object} payload 
     * @param {string} expiresIn 
     * @returns {string}
     */
    static generateToken(payload: object, expiresIn: string): string {
        if(!expiresIn) { return JWT.sign(payload, config.JWT_TOKEN_SECRET); }

        return JWT.sign(
            payload, 
            <string>config.JWT_TOKEN_SECRET, 
            { expiresIn }
        );
    }

    /**
     * @method verifyToken
     * @static
     * @param {string} token 
     * @returns {string|JwtPayload}
     */
    static verifyToken(token: string): string|JwtPayload {
        try {
            return JWT.verify(
                token, 
                config.JWT_TOKEN_SECRET
            );
        } catch(err: any) {
            throw new UnauthenticatedError(err.message);
        }
    }

}

export default JwtHelper;