import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hi')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hi2')
  getHello2(): string {
    return this.appService.getHello2();
  }
}
