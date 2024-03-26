import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
// import { getLocalDateString } from 'src/utils/convetions';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/entities/user.entity';

// import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.userService.getUser({ username });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const { password, ...result } = user;
          return result;
        }
      }
    } catch (err) {
      throw new HttpException(
        { statusCode: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return null;
  }

  async login(user: any): Promise<any> {
    try {
      const payload = { username: user.username };
      const { password, ...userData } = user;
      const token = await this.jwtService.signAsync(payload);
      Logger.log('*************user  *************');
      Logger.log(user);
      const journal = await this.userService.updateJournalDay(
        user._doc.username,
      );
      Logger.log('*************journal  *************');
      Logger.log(journal);
      return {
        access_token: token,
        user: userData,
      };
    } catch (err) {
      throw new HttpException(
        { statusCode: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

}
