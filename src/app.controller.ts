import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { Chat } from 'twitch-js';
import { TranslationService } from './translation/translation.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly translationService: TranslationService
  ) {}

  @Get()
  async startTwitchBot(): Promise<void> {
    let chatSession: Chat = await this.appService.startChatSession();
    await this.translationService.translateMessage(chatSession);
  }
}
