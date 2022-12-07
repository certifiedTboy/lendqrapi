import db from "../database/config/index";
import { IAuthPayload } from "../interfaces/IAuthPayload";
import { DeviceMobileCategory } from "../constants/DeviceMobileCategory";
import DateTimeCalculator from "../helpers/DateTimeCalculator";
import JwtHelper from "../helpers/JwtHelper";

/**
 * @class SessionService
 */
class SessionService {
  /**
   * @method createOrUpdatePlatformSession
   * @static
   * @async
   * @param {User} user
   * @param {DeviceMobileCategory} platform
   * @param {string} ipAddress
   * @returns {Promise<UserSession>}
   */
  static async createOrUpdatePlatformSession(
    user: any,
    platform: DeviceMobileCategory,
    ipAddress: string
  ) {
    let userSession = await this.getUserPlatformSession(user.userId, platform);

    if (userSession) {
      const AUTH_TOKEN_TTL_IN_HOURS = 24;
      const AUTH_TOKEN = await this.getAuthToken(
        user.userId,
        user.role,
        AUTH_TOKEN_TTL_IN_HOURS
      );
      const EXPIRES_AT = DateTimeCalculator.getDateTimeInNext(
        AUTH_TOKEN_TTL_IN_HOURS
      );
      const updateSessionData = {
        token: AUTH_TOKEN,
        ipAddress,
        expiresAt: EXPIRES_AT,
      };

      const newUserSession = await db("userSession")
        .update(updateSessionData)
        .where("sessionId", userSession.sessionId);

      return userSession;
    }
  }

  /**
   * @method getUserPlatformSession
   * @static
   * @async
   * @param {string} userId
   * @param {string} platform
   * @returns {Promise<UserSession>}
   */
  private static async getUserPlatformSession(
    userId: string,
    platform: DeviceMobileCategory
  ) {
    let [userSession] = await db
      .from("userSession")
      .select("*")
      .where("userId", "=", userId);

    if (!userSession) {
      const sessionData = {
        userId,
        platform,
      };
      const [newSession] = await db("userSession").insert(sessionData);

      let [foundSession] = await db
        .from("userSession")
        .where("sessionId", "=", newSession);
      userSession = foundSession;
    }

   

    return userSession;
  }

  /**
   * @method getAuthToken
   * @static
   * @param param0
   * @param {number} ttlInHours
   * @returns {string}
   */
  private static getAuthToken(
    id: string,
    role: string,
    ttlInHours: number
  ): string {
    const PAYLOAD: IAuthPayload = { id, role };

    return JwtHelper.generateToken(PAYLOAD, `${ttlInHours}h`);
  }
}

export default SessionService;
