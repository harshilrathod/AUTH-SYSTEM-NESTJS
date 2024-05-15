import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUser } from './dto/create-user.dto';
import { VerifyOtp } from './dto/verifyUser.dto';
import { LoginDto } from './dto/login.dto';
import { JWTAuthGuard } from 'src/auth/jwt.authguard';
import { UpdateUserDto } from './dto/update-profile.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  create(@Body() registerUser: RegisterUser) {
    return this.userService.create(registerUser);
  }

  @Post('/verify')
  verifyOtp(@Body() body: VerifyOtp) {
    return this.userService.verifyOtp(body);
  }

  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }

  @UseGuards(JWTAuthGuard)
  @Get('profile')
  getUserProfile(@Req() req: any) {
    return this.userService.getProfile(req);
  }


  @UseGuards(JWTAuthGuard)
  @Post('refreshToken')
  refreshToken(@Req() req: any) {
    return this.userService.refreshToken(req);
  }

  @UseGuards(JWTAuthGuard)
  @Put('updateProfile')
  updateProfile(@Req() req: any,@Body() body: UpdateUserDto) {
    return this.userService.updateUserProfile(req,body);
  }

}
