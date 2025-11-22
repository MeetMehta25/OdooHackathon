import crypto from "crypto";

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

// Generate alphanumeric OTP
export const generateAlphanumericOTP = (length: number = 6): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    otp += characters[randomIndex];
  }

  return otp;
};

// Generate OTP expiry time (default 10 minutes)
export const generateOTPExpiry = (minutes: number = 10): Date => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minutes);
  return expiry;
};

// Verify OTP expiry
export const isOTPExpired = (expiryDate: Date): boolean => {
  return new Date() > new Date(expiryDate);
};

// Generate secure token for password reset
export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

// Hash OTP for storage (optional security measure)
export const hashOTP = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

// Compare hashed OTP
export const compareOTP = (plainOTP: string, hashedOTP: string): boolean => {
  const hashedInput = hashOTP(plainOTP);
  return hashedInput === hashedOTP;
};
