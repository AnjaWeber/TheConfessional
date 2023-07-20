import { Injectable } from '@nestjs/common';
import { Confession } from './model/confession.model';
import { ThermalPrinter, PrinterTypes } from 'node-thermal-printer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrinterService {
  private readonly printer: ThermalPrinter;

  constructor(private readonly configService: ConfigService) {
    const printerName = this.configService.get('PRINTER_NAME');
    this.printer = new ThermalPrinter({
      type: PrinterTypes.EPSON, // 'star' or 'epson'
      interface: `printer:${printerName}`,
      options: {
        timeout: 1000,
      },
      width: 48, // Number of characters in one line - default: 48
      driver: require('@thiagoelg/node-printer'),
    });
  }

  async printLabel(confession: Confession) {
    console.log(confession);
    const isConnected = await this.printer.isPrinterConnected();
    console.log('Printer connected:', isConnected);
    if (isConnected) {
      this.printer.clear();
      this.printer.alignCenter();
      const logoFileName = confession.message.toLowerCase().includes('taubsi')
        ? 'taubsi_coupe.png'
        : 'logo.png';
      await this.printer.printImage(`dist/assets/${logoFileName}`);

      this.printer.alignCenter();
      this.printer.newLine();
      this.printer.setTextDoubleHeight();
      const lines = confession.message.match(/(.{1,48}(\s|$))\s*/g);
      lines.forEach((line) => this.printer.println(line.trim()));

      this.printer.cut();

      console.log(this.printer.getText());

      try {
        await this.printer.execute();
        console.log('Print success.');
      } catch (error) {
        console.error('Print error:', error);
      }
    }
  }
}
