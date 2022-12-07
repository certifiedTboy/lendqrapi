import config from "../../config/index"
const {transport} = require("../EmailService")


export const sendUserVerificationEmail = async(email:String, name:String, OTP:number) => {
  console.log(email, OTP, name)
    const mailOptions = {
        to: email,
        from: config.SMTP_USER,
        subject: "Welcome to LendQr",
        html: ` <div> 
        
        <p> Dear <strong>${name} </strong> </p>,

        <h4> Welcome to LendQr </h4>

        <p> Enter this 6 digit OTP: ${OTP} to verify your email address</p>
        
        <p>Thanks </p>.
        <div>`,
      };

      transport.sendMail(mailOptions, (err:any) => {
        if (err) {
            console.log(err);
        }
        console.log({ success: "email is sent successfully", OTP  });
      
      });
}

// module.exports.sendPasswordResetUrl = async(email:String, name:String, resetPasswordUrl:String) => {
  
//   const mailOptions = {
//     to: email, 
//     from: config.SMTP_HOST, 
//     subject : "HOUSE OF SOUNDS - ACCOUNT PASSWORD RESET 🎉🎉🎉 ",

//     html : `<div> 
        
//     <p> Hi <strong>${name} </strong> </p>,

//     <h4> You requested for a password reset </h4>

//     <a href="${resetPasswordUrl}" style="color:white; font-weight:600; padding:10px; width: 400px; background-color:blue"> Reset Password</a>
    
//     <p>Thanks </p>.
//     <div>
//     `
//   }
  
//   transport.sendMail(mailOptions, (err:any) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log({ success: "email is sent successfully", resetPasswordUrl  });
  
//   });
// }

// module.exports.SendInvite = async(to:any, from:any, link: any) => {
  
//   let clientUrl = `https://invitation-system.thoseapp.com/invite/${from}-${link}`;
//   var mailOptions = {
//     from: config.SMTP_HOST,
//     to: to,
//     subject: "You have been Invited to join this organization",
//     html: `<p> Your invitation link is: <a href='${clientUrl}'> ${clientUrl}</a>`
//   };
//   transport.sendMail(mailOptions, function(error: any, info: { response: string; }) {
//     if (error) {
//       return console.log(error);
//     } else {
//       console.log("Email sent: " + info.response);
//     }
//   });
// }