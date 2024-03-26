import {
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
// import { User } from 'src/modules/user/entities/user.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @UseGuards(LocalAuthGuard)
  @Public() //to skip the guard
  @Post('auth/login')
  async login(@Request() req: any) {
    if (!req.body.username || !req.body.password) {
      throw new HttpException(
        { error: 'Invalid login request' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.authService.login(req.user);
  }

  // @Post('auth/change-password')
  // async changePasswod(@Request() req: any) {
  //   if (!req.body.token || !req.body.password) {
  //     throw new HttpException(
  //       { error: 'Invalid change password request' },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const token = req.body.token;
  //   const newPassword = req.body.password;
  //   return await this.authService.changePasswod(token, newPassword);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('auth/profile')
  // async getProfile(@Request() req: any) {
  //   return await this.authService.getUser(req.user);
  // }

  // @Post('auth/forgot-password')
  // async forgotPasswod(@Request() req: any) {
  //   if (!req.body.username) {
  //     throw new HttpException(
  //       { error: 'Invalid change password request' },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   return await this.authService.forgotPasswod(req.body.username);
  // }
}
