import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { SkipThrottle } from '@nestjs/throttler';
import { ConfessionsService } from './services/confessions.service';
import { CreateConfessionDto } from './dto/create-confession.dto';

@Controller()
export class AppController {
  constructor(
    @Inject('MQTT_CLIENT') private mqttClient: ClientProxy,
    private readonly appService: AppService,
    private readonly confessionsService: ConfessionsService,
  ) {}

  @SkipThrottle()
  @Post()
  async createConfession(@Body() createConfessionDto: CreateConfessionDto) {
    const confession = await this.confessionsService.readAndDeleteRandom();
    console.log(confession);
    await this.confessionsService.create(createConfessionDto);
    this.mqttClient.emit('black-box/print-label', confession);
  }

  @SkipThrottle()
  @Get()
  async getRandomConfession() {
    const confession = await this.confessionsService.readRandom();
    console.log(confession);
    return confession;
  }
}
