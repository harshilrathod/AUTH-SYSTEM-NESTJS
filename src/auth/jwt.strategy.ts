import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/module/user/user.service';
import { Constants } from 'src/shared/constants';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private authService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
      expiresIn: '1h'
    });
    
  }

  async validate(payload) {
    const user = await this.authService.getUserById(payload.id);
    if (!user) {
      throw new Error(Constants.ResponseMessages.NOT_VALID_TOKEN);
    }
    return user;
  }
}
