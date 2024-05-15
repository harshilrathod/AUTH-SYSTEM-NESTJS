import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RegisterUser } from './dto/create-user.dto';
import { PrismaClient } from '@prisma/client'
import { Utils } from 'src/shared/utility';
import { EmailService } from 'src/shared/mail.service';
import { response } from 'src/shared/response.util';
import { Constants } from 'src/shared/constants';
import { VerifyOtp } from './dto/verifyUser.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { UpdateUserDto } from './dto/update-profile.dto';



@Injectable()
export class UserService {

  public prisma = new PrismaClient()

  constructor(
    private readonly emailService: EmailService,
    private jwtService: JwtService
  ) { }

  async create(registerUser: any) {
    try {
      const { email, password } = registerUser;
      const checkEmailExist = await this.prisma.user.findFirst({ where: { email: email } });

      if (checkEmailExist) {
        return response(HttpStatus.FOUND, Constants.ResponseMessages.EMAIL_EXIST);
      }

      const otp = Utils.generateUniqueOtp();
      registerUser.otp = otp;
      const hashPassword = await Utils.hashPassword(password);
      registerUser.password = hashPassword;
      const saveUser = await this.prisma.user.create({ data: registerUser });
      await this.emailService.sendEmail(registerUser.email, 'Your OTP', `Your otp is ${otp}`);

      if (saveUser) {
        return response(HttpStatus.OK, Constants.ResponseMessages.OTP_SENT_SUCCESS);
      }
      else {
        return response(HttpStatus.BAD_REQUEST, Constants.ResponseMessages.SOMETHING_WENT_WRONG);
      }
    }
    catch (err) {
      console.log(err);
      return response(HttpStatus.BAD_REQUEST, Constants.ResponseMessages.SOMETHING_WENT_WRONG);
    }
  }

  async verifyOtp(body: VerifyOtp) {
    try {
      const { otp, email } = body;
      const checkUser = await this.prisma.user.findFirst({ where: { email: email, otp: otp } });
      if (checkUser) {
        const updateUser = await this.prisma.user.update({ where: { email: email, otp: otp }, data: { isVerify: true, otp: null } });
        return response(HttpStatus.OK, Constants.ResponseMessages.SUCCESS_VERIFY);
      }
      else {
        return response(HttpStatus.BAD_REQUEST, Constants.ResponseMessages.INVALID_OTP);
      }
    }
    catch (err) {
      console.log(err);
      return response(HttpStatus.BAD_REQUEST, Constants.ResponseMessages.SOMETHING_WENT_WRONG);
    }
  }

  async login(body: LoginDto) {
    try {
      const { email, password } = body;
      const checkUser = await this.prisma.user.findFirst({ where: { email: email } });
      if (checkUser) {

        if (!checkUser.isVerify) {
          return response(HttpStatus.BAD_REQUEST, Constants.ResponseMessages.EMAIL_NOT_VERIFIED);
        }

        if (!Utils.comparePasswords(password, checkUser.password)) {
          return response(HttpStatus.BAD_REQUEST, Constants.ResponseMessages.INVALID_EMAIL_PASSWORD);
        }

        const userId = checkUser.id;

        const responsePayload: any = {
          firstName: checkUser.firstName,
          lastName: checkUser.lastName,
          email: checkUser.email
        }

        const accessToken = this.jwtService.sign({ id: checkUser.id });
        const refreshToken = this.jwtService.sign({ id: checkUser.id }, { expiresIn: process.env.MONTH_EXPIRE_IN });

        responsePayload.accessToken = accessToken;
        responsePayload.refreshToken = refreshToken;

        await this.prisma.user.update({ where: { id: userId }, data: { token: accessToken, refreshToken: refreshToken } });

        return response(HttpStatus.OK, Constants.ResponseMessages.LOGIN_SUCCEESS, responsePayload);
      }
      else {
        return response(HttpStatus.BAD_REQUEST, Constants.ResponseMessages.INVALID_EMAIL_PASSWORD);
      }
    }
    catch (err) {
      console.log(err);
      return response(HttpStatus.BAD_REQUEST, Constants.ResponseMessages.SOMETHING_WENT_WRONG);
    }
  }

  async getProfile({ user }) {
    try {
      const { id } = user;
      const profile = await this.prisma.user.findFirst(
        {
          where: { id },
          select: {
            id: true,
            firstName: true,
            email: true,
            lastName: true
          }
        }
      );
      return response(HttpStatus.OK, Constants.ResponseMessages.SUCCESS, profile);
    }
    catch (err) {
      console.log(err);
      return response(HttpStatus.BAD_REQUEST, Constants.ResponseMessages.SOMETHING_WENT_WRONG);
    }
  }

  async refreshToken(req) {
    try {
      const { user } = req;
      const { id } = user;
      const accessToken = this.jwtService.sign({ id: id });

      await this.prisma.user.update({ where: { id: id }, data: { token: accessToken } });

      return response(HttpStatus.OK, Constants.ResponseMessages.SUCCESS, { accessToken });
    }
    catch (err) {
      console.log(err);
      return response(HttpStatus.BAD_REQUEST, Constants.ResponseMessages.SOMETHING_WENT_WRONG);
    }
  }

  async updateUserProfile({ user }, body: UpdateUserDto) {
    try {
      const { id } = user;
      const updateUser = await this.prisma.user.update({ where: { id }, data: body });
      return response(HttpStatus.OK, Constants.ResponseMessages.USER_UPDATED, updateUser);
    }
    catch (err) {
      console.log(err);
      return response(HttpStatus.BAD_REQUEST, Constants.ResponseMessages.SOMETHING_WENT_WRONG);
    }
  }

  async getUserById(id: number) {
    return await this.prisma.user.findFirst(
      {
        where: { id },
        select: {
          id: true,
          firstName: true,
          email: true,
          lastName: true
        }
      }
    );
  }
}
