import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect } from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
    private user: string;
    private password: string;
    private host: string;
    private port: string;

    configService: ConfigService = new ConfigService();

    private mqttClient;

    onModuleInit() {
        this.user = this.configService.get<string>('PHYSICS_MQTT_USER');
        this.password = this.configService.get<string>('PHYSICS_MQTT_PASSWORD');
        this.host = this.configService.get<string>('PHYSICS_MQTT_HOST');
        this.port = this.configService.get<string>('PHYSICS_MQTT_PORT');
        const connectUrl = `mqtt://${this.host}:${this.port}`;

        this.mqttClient = connect(connectUrl, {
            username: this.user,
            password: this.password,
            clean: true,
            connectTimeout: 4000,
            reconnectPeriod: 1000,
        });

        this.mqttClient.on('connect', function () {
            Logger.log('Connected to MQTT');
        });

        this.mqttClient.on('error', function () {
            Logger.error('Error in connecting to MQTT');
        });
    }

    publish(topic: string, payload: string): string {
        Logger.log(`Publishing to ${topic}`);
        this.mqttClient.publish(topic, payload);
        return `Publishing to ${topic}`;
    }
}
