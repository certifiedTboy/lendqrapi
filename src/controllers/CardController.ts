import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../../lib/src/helpers";
import CardService from "../services/CardService";

/**
 * @class CardController
 */
class CardController {
  /**
   * @method addCard
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async addCard(req: any, res: Response, next: NextFunction) {
    const userId = req.user.id;

    try {
      const { cardName, cardNumber, cardPin, CVV2, cardType } =
        req.body;

      const cardData = {
        cardName,
        cardType,
        cardPin,
        cardNumber,
        CVV2
      };

      const addedCard = await CardService.addCard(
        userId,
        cardData
      );
      ResponseHandler.created(res, addedCard, "card added successfully");
    } catch (err) {
      next(err);
    }
  }

   /**
   * @method removeCard
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
    static async removeCard(req: any, res: Response, next: NextFunction) {
        const {cardId} = req.params
        try {
            const response = await CardService.removeCard(cardId)
         ResponseHandler.ok(res, undefined, "card removed successfully");
        } catch (err) {
          next(err);
        }
      }
}

export default CardController;
