import { UserType } from "../constants";

/**
 * @interface ICreateUser
 */
export interface ICreateUser {
    email: string;
    surnName: string;
    firstName: string;
    phoneNumber: string;
    gender:string;
    role: UserType;
    dateOfBirth:string;
}
