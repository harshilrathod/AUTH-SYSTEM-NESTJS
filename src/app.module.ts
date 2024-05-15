import { Module, ValidationPipe } from '@nestjs/common';
import { UserModule } from './module/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UserModule
  ],
  controllers: [],
  providers: [  
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
],
})
export class AppModule {}
