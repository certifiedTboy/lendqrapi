import UserService from "../services/UserService";
import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../lib/src/helpers";



/**
 * @class UserController
 */
class UserController {
  /**
   * @method createUser
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, surnName, firstName, phoneNumber, role, gender, OTP, dateOfBirth } = req.body;
      const userData = {
        email, surnName, firstName, phoneNumber, role, gender, OTP, dateOfBirth
      }
      const createdUser = await UserService.createUser(userData)
      ResponseHandler.created(res, createdUser, "new user created");
    } catch (err) {
      next(err);
    }
  }


   /**
   * @method uploadProfileImage
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
    static async uploadProfileImage(req: any, res: Response, next: NextFunction) {
      req.files as { [originalname: string]: Express.Multer.File[] };

      const uploadImageUrl = "uploads/" + req.file.originalname      
      
      const userId = req.user.id
      try {
        const updateProfile = UserService.updateProfilePicture(userId, uploadImageUrl) 
        
        if(updateProfile){
          ResponseHandler.created(res, updateProfile, "user profile picture updated");
        }
        
      } catch (err) {
        next(err);
      }
}


  /**
   * @method addBvn
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
   static async addBvn(req: any, res: Response, next: NextFunction) {
    
    const userId = req.user.id
    const {bvn} = req.body
    try {
      const updateBvn = UserService.updateBvn(userId, bvn) 
      
      if(updateBvn){
        ResponseHandler.created(res, updateBvn, "user bvn updated");
      }
      
    } catch (err) {
      next(err);
    }
}


   /**
   * @method getAllUsers
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
    static async getAllUsers(req: Request, res: Response, next: NextFunction) {
      try {
        const users = await UserService.getUsers()
        ResponseHandler.ok(res, users, "success")
      } catch (err) {
        next(err);
      }
}


/**
   * @method getAUser
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
 static async getAUser(req: any, res: Response, next: NextFunction) {
  const userId = req.user.id
  try {
    const user = await UserService.getUser(userId)
    if(user){
      ResponseHandler.ok(res, user, "success")
    }
  } catch (err) {
    next(err);
  }
}

}

export default UserController;
