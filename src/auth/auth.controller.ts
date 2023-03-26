import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response as ResponseType } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';



@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    const tokens = this.authService.signUp(createUserDto);
    return JSON.stringify({tokens.accessToken})
  }

  @Post('signin')
  async signin(
    @Body() data: AuthDto,
    @Res({ passthrough: true }) res: ResponseType ){
      const authToken = await this.authService.signIn(data);
      this.authService.storeTokenInCookie(res, authToken)
      const {accessToken} = authToken
      return {accessToken}
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(
    @Req() req: Request, 
    @Res({ passthrough: true }) res: ResponseType
  ) {
    const refreshToken = req.get('Authorization') !== undefined ? req.get('Authorization').replace('Bearer', '').trim() : req.cookies.refreshToken;
    const newAuthToken = await this.authService.refreshTokens(req.user['sub'], refreshToken);
    this.authService.storeTokenInCookie(res, newAuthToken);
    const {accessToken} = newAuthToken
    return {accessToken}
  }
}