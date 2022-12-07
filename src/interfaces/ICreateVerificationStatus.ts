
/**
 * @interface ICreateVerificationStatus
 */
export interface ICreateVerificationStatus {
    emailIsVerified: boolean;
    phoneNumberIsVerified: boolean;
    bvnIsVerified: boolean;
    userId: string;
}
