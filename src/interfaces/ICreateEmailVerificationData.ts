/**
 * @interface ICreateEmailVerificationData
 */
export interface ICreateEmailVerificationData {
    email: string;
    OTP: number;
}


/**
 * @interface ICreatePhoneNumberVerificationData
 */
 export interface ICreatePhoneNumberVerificationData {
    phoneNumber: string;
    OTP: number;
}