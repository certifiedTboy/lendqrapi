import { loanStatus } from "../constants";

/**
 * @interface ICreateLoan
 */
export interface ICreateLoan {
    purpose: string;
    status: loanStatus;
    guarantorName: string;
    guarantorPhoneNumber: number;
    amount: number;
    interest:number;
    days:number;
    userId:string
}
