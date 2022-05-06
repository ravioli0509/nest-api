import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hi')
  getHello(): void {
    return this.appService.translateBot();
  }

  @Get('hi2')
  getHello2(): string {
    return this.appService.getHello2();
  }
}
