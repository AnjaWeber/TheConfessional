import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { Confession, ConfessionSchema } from './schemas/confession.schema';
import { ConfessionsService } from './services/confessions.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 1,
    }),
    MongooseModule.forFeature([
      { name: Confession.name, schema: ConfessionSchema },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log(configService.get<string>('MONGODB_URI'));
        return {
          uri: configService.get<string>('MONGODB_URI'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'MQTT_CLIENT',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.MQTT,
          options: {
            url: configService.get('MQTT_URL'),
            username: configService.get('MQTT_USERNAME'),
            password: configService.get('MQTT_PASSWORD'),
          },
        });
      },
      inject: [ConfigService],
    },

    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },

    AppService,
    ConfessionsService,
  ],
})
export class AppModule {}
