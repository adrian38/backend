import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

declare const module: any;

async function bootstrap() {
    let configService: ConfigService = new ConfigService();
    const log_level = configService.get<string>('PHYSICS_LOG_LEVEL');

    let valid_levels = [];
    if (log_level && log_level.toUpperCase() === 'ERROR') {
        valid_levels = ['error'];
    } else if (log_level && log_level.toUpperCase() === 'WARN') {
        valid_levels = ['error', 'warn'];
    } else if (log_level && log_level.toUpperCase() === 'INFO') {
        valid_levels = ['error', 'warn', 'log'];
    } else if (log_level && log_level.toUpperCase() === 'DEBUG') {
        valid_levels = ['error', 'warn', 'log', 'debug'];
    } else {
        console.error('Invalid log level configured. Set to default INFO');
        valid_levels = ['error', 'warn', 'log'];
    }

    const app = await NestFactory.create(AppModule, {
        logger: valid_levels,
    });
    const reflector = app.get(Reflector);
    const authGuard = new JwtAuthGuard(reflector);
    app.enableCors({
        origin: '*',
    });

    app.useGlobalGuards(authGuard);
    await app.listen(3000);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
