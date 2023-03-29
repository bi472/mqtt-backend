import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response as ResponseType } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({summary: "Sign up"})
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: "Store refresh and access token in cookies. Return access token."})
  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: ResponseType) {
    const tokens = await this.authService.signUp(createUserDto);
    this.authService.storeTokenInCookie(res, tokens)
    const {accessToken} = tokens
    return JSON.stringify({accessToken})
  }

  @ApiOperation({summary: "Sign in"})
  @ApiBody({ type: AuthDto })
  @ApiOkResponse({ description: "Store refresh and access token in cookies. Return access token."})
  @Post('signin')
  async signin(
    @Body() data: AuthDto,
    @Res({ passthrough: true }) res: ResponseType ){
      const authToken = await this.authService.signIn(data);
      this.authService.storeTokenInCookie(res, authToken)
      const {accessToken} = authToken
      return {accessToken}
  }

  @ApiOperation({summary: "Logout", description: "Update users refresh tokens to null"})
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @ApiOperation({summary: "Refresh access token", description: "Update access and refresh tokens by current refresh token."})
  @ApiBearerAuth()
  @ApiCookieAuth()
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