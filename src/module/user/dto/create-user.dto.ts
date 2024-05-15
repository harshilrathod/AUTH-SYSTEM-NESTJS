import { IsNotEmpty } from 'class-validator';

export class RegisterUser {
    @IsNotEmpty()
    email : string;

    @IsNotEmpty()
    firstName : string;

    @IsNotEmpty()
    lastName : string;

    @IsNotEmpty()
    password : string;

}
