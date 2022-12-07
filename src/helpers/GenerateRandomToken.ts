export const generateRandomToken = async() => {
  const OTP = Math.floor(100000 + Math.random() * 900000)
  return  OTP
}


export const generateRandomWalletNumber = async () => {
  const walletNumber = Math.floor(1000000000 + Math.random() * 9000000000)
  return walletNumber
}

