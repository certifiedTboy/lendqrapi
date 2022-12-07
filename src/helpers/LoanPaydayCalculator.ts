

/**
 * @class LoanPaydayCalculator
 */
class LoanPaydayCalculator {

    /**
     * @name calculatePayday
     * @static
     * @param approvalDate 
     * @param days
     * @returns 
     */
    static calculatePayday(days: number) {

        const date = new Date()
        date.setDate(new Date().getDate() + days)
        return date
    }

   /*  /**
     * @name formatDate
     * @static
     * @param calcDate 
     * @returns 
     */
    /*  private static formatDate(calcDate:any) {
         return [
        ("0" + calcDate.getDate()).slice(-2),           
        ("0" + (calcDate.getMonth()+1)).slice(-2),      
        calcDate.getFullYear()                          
     ].join('/'); 

    } */ 
}

export default LoanPaydayCalculator;