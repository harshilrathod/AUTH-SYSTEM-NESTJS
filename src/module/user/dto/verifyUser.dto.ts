import { IsNotEmpty } from "class-validator";

export class VerifyOtp {
    @IsNotEmpty()
    otp : number;

    @IsNotEmpty()
    email : string;
}
