import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';

import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CommonService } from 'src/services/common.service';

@Module({
    imports: [
        UserModule,
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        MongooseModule.forRootAsync({
            imports: [ConfigModule], // import ConfigModule here
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('PHYSICS_MONGO_DB'),
            }),
            inject: [ConfigService],
        }),

        AuthModule,
    ],
    controllers: [AppController],
    providers: [Logger, AppService, CommonService],
})
export class AppModule {
    constructor() {}
}
