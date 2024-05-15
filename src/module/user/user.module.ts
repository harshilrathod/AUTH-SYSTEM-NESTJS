import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from 'src/shared/mail.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JWTAuthGuard } from 'src/auth/jwt.authguard';

@Module({
  imports: [
    ConfigModule.forRoot( {envFilePath: '.env'}), // Ensure ConfigModule.forRoot() is imported first
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }
      }),
    }),
  ],
  controllers: [UserController],
  providers: [ConfigService,EmailService,UserService,
    JwtStrategy,
    // JwtService
  ],
  // exports : [UserService,EmailService]
})

export class UserModule { }
