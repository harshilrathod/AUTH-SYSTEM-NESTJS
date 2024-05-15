
import * as bcrypt from 'bcryptjs';

export class Utils {
    public static generateUniqueOtp() {
        const digits = '0123456789'; 
        let OTP = ''; 
        for (let i = 0; i < 6; i++ ) { 
            OTP += digits[Math.floor(Math.random() * 10)]; 
        } 
        return +OTP; 
    }

    public static async hashPassword(password: string): Promise<string> {
        const saltRounds = 10; // You can adjust the salt rounds as needed
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }

    public static async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}


