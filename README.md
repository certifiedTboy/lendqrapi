## LENDQRAPI 

A simple api for loan application and wallet functionality.

 #### BASE URL https://emmanuel-tosin-lendqr-be-test.heokuapp.com

#### POSTMAN URL https://documenter.getpostman.com/view/24516291/2s8YsryZe3

# Getting Started 

#### Creating Account

**Method :** "POST"

**data:** email

**Response:** Random generated OTP

**URL** BASE_URL/api/v1/verify/email

#### Verify Email // Registering User Account 

**Method :** "POST"

**data :** {
    surnName: string, 
    firstName: string,
    email: inital email provided, 
    phoneNumber: string (Max lenght = 11),
    role: string (USER || ADMIN),
    gender: string,
    "dateOfBirth": Date ("1996-06-02"), 
    OTP: the random generated OTP 
}

**Response:** New user account details with a unique id

**URL** BASE_URL/api/v1/users

#### Create Passcode for new user

**Method :** "POST"

**data:** {userId:string, passCode: number (max lenght: 6)}

**Response:** success message {message:"pass code created"}

**URL** BASE_URL/api/v1/auth/passcode

# User Authentication  

#### Login User

**Method :** "POST"

**data :** {
    email: userEmail, || phoneNumber: userPhoneNumber
    passCode: userPasscode 
}

**Response:** User Data and access jsonwebtoken

**URL** BASE_URL/api/v1/auth/login


#### Creating User TransactionId

**Method :** "PUT"

**data:** {transactionId: number (max lenngth: 4)}

**Response:** success message {message: transactionId created}

**URL** BASE_URL/api/v1/users/transactionId

#### Send Money to User 

**Method :** "POST"

**data :** {
    walletNumber: number (max lenght: 11) 
    amount: number (must not exceed current wallet balance of sender)
}

**Response:** success message ({message: money sent successfully})

**URL** BASE_URL/api/v1/transaction/send-money-to-user


# For other request visit the POSTMAN URL



