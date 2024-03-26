import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class CommonService implements OnModuleInit {
    constructor(private userService: UserService, private configService: ConfigService) {}

    onModuleInit() {
        this.checkInitUserCreated();
    }

    async checkInitUserCreated() {
        const count = await this.userService.countWhere('');
        Logger.log('************* validateUser in first startup *************');
        if (count <= 0) {
            const superUser = await this.getDefaultSuperUser();
            Logger.log('============= creating superUser =============');
            await this.userService.createSuperUser(superUser.username, superUser.password, superUser.email, superUser.role);
        } else {
            Logger.warn('============= Default user already init =============');
        }
    }

    async getDefaultSuperUser(): Promise<User> {
        const super_user = this.configService.get<string>('PHYSICS_DEFAULT_USER');
        const super_user_pass = this.configService.get<string>('PHYSICS_DEFAULT_PASSWORD');

        const superUser = {
            username: super_user,
            password: super_user_pass,
            email: '',
            role: 0,
        };
        return superUser as User;
    }
}
