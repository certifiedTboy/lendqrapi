import { ConflictError } from "../../lib/src/exceptions";
import db from "../database/config/index";
import { ICreateCard } from "../interfaces/ICreateCard";

/**
 * @class CardService
 */
class CardService {
  /**
   * @method addCard
   * @static
   * @async
   * @param {object} cardData
   * @returns {Promise<CardDetails>}
   */
  static async addCard(userId: string, data: any) {
    const cardData: ICreateCard = {
      cardName: data.cardName,
      cardType: data.cardType,
      cardPin: data.cardPin,
      cardNumber: data.cardNumber,
      CVV2: data.CVV2,
      userId,
    };

    await this.checkThatNameCorrespond(userId, data.carName);
    const bankCard = await db("cardDetails").insert(cardData);
    const [newBankCard] = await db
      .from("cardDetails")
      .select("*")
      .where("cardId", "=", bankCard);

    return newBankCard;
  }

  /**
   * @method removeCard
   * @static
   * @async
   * @param {string} cardId
   * @returns {Promise<void>}
   */
  static async removeCard(cardId: string) {
    const removedCard = await db("cardDetails")
      .where("cardId", cardId)
      .del(["cardId", "cardId"], { includeTriggerModifications: true });

    return removedCard;
  }

  /**
   * @method checkThatNameCorrespond
   * @static
   * @async
   * @param {object} bankData
   * @returns {Promise<void>}
   */
  static async checkThatNameCorrespond(
    userId: string,
    cardName: any
  ): Promise<void> {
    const [user] = await db
      .from("users")
      .select("*")
      .where("userId", "=", userId);

    const cardFullName = user.surnName + " " + user.firstName;

    if (cardFullName !== cardName) {
      throw new ConflictError("invalid card");
    }
  }
}

export default CardService;
