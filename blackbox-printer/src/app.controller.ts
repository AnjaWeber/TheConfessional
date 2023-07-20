import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Confession } from './model/confession.model';
import { PrinterService } from './printer.service';

@Controller()
export class AppController {
  constructor(private readonly printerService: PrinterService) {}

  @EventPattern('black-box/print-label')
  async printLabel(@Payload() confession: Confession) {
    await this.printerService.printLabel(confession);
  }
}
