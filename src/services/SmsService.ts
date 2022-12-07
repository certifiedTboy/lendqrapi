const axios = require("axios");
import config from "../config"


const token = config.SMS_TOKEN
const key = config.SMS_KEY
const number = config.SMS_NUMBER

export const sendSms = async (phoneNumber: string, code: number) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
console.log(phoneNumber, code)
  const validPhoneNo = phoneNumber.slice(1)
  const data = {
    from: `${number}`,
    to: [`234${validPhoneNo}`],
    body: `your lendqr otp code is: ${code}`,
  };
  const respone = await fetch(
    `https://sms.api.sinch.com/xms/v1/${key}/batches`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: headers,
    }
  );

  console.log("sms sent successfuly");
};
