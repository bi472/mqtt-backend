import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
  ], 
  controllers: [AuthController],
  providers: [ConfigService, AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}